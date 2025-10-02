using Microsoft.AspNetCore.Mvc;
using properties_app_backend.Extensions;
using properties_app_backend.Models;
using properties_app_backend.Repositories;
using System.ComponentModel.DataAnnotations;

namespace properties_app_backend.Controllers;

/// <summary>
/// Controller for managing properties
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class PropertiesController : ControllerBase
{
	private readonly IPropertyRepository _propertyRepository;
	private readonly IOwnerRepository _ownerRepository;

	public PropertiesController(IPropertyRepository propertyRepository, IOwnerRepository ownerRepository) // IGridFSService gridFSService)
	{
		_propertyRepository = propertyRepository;
		_ownerRepository = ownerRepository;
	}

	/// <summary>
	/// Get all properties with optional filters
	/// </summary>
	/// <param name="name">Filter by property name (partial match)</param>
	/// <param name="address">Filter by property address (partial match)</param>
	/// <param name="minPrice">Filter by minimum price</param>
	/// <param name="maxPrice">Filter by maximum price</param>
	/// <returns>List of filtered properties</returns>
	/// <response code="200">Returns the list of properties</response>
	[HttpGet]
	[ProducesResponseType(typeof(IEnumerable<PropertyDto>), StatusCodes.Status200OK)]
	public async Task<ActionResult<IEnumerable<PropertyDto>>> GetAll(
		[FromQuery] string? name = null,
		[FromQuery] string? address = null,
		[FromQuery] decimal? minPrice = null,
		[FromQuery] decimal? maxPrice = null)
	{
		// Use optimized repository method that builds expression tree before execution
		var properties = await _propertyRepository.GetAllWithFiltersAsync(name, address, minPrice, maxPrice);

		var propertyDtos = properties.Select(p => p.ToDto());
		return Ok(propertyDtos);
	}

	/// <summary>
	/// Get a specific property by ID
	/// </summary>
	/// <param name="id">The property's unique identifier</param>
	/// <returns>The property details</returns>
	/// <response code="200">Returns the property</response>
	/// <response code="404">If the property is not found</response>
	[HttpGet("{id}")]
	[ProducesResponseType(typeof(PropertyDto), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<ActionResult<PropertyDto>> GetById([Required] string id)
	{
		var property = await _propertyRepository.GetByIdAsync(id);
		if (property == null)
			return NotFound($"Property with ID {id} not found");

		return Ok(property.ToDto());
	}

	/// <summary>
	/// Create a new property
	/// </summary>
	/// <param name="imageFile">The property image file</param>
	/// <param name="propertyDto">The property data to create</param>
	/// <returns>The created property</returns>
	/// <response code="201">Returns the newly created property</response>
	/// <response code="400">If the property data is invalid</response>
	[HttpPost]
	[ProducesResponseType(typeof(PropertyDto), StatusCodes.Status201Created)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	public async Task<ActionResult<PropertyDto>> Create(
			[FromForm][Required] PropertyCreateOrUpdateDto propertyDto,
			IFormFile? imageFile
		)
	{
		if (!ModelState.IsValid)
			return BadRequest(ModelState);

		// Validate that the Owner exists
		var ownerExists = await _ownerRepository.GetByIdAsync(propertyDto.IdOwner);
		if (ownerExists == null)
			return BadRequest($"Owner with ID {propertyDto.IdOwner} does not exist");

		// Create property from DTO
		var property = propertyDto.ToEntity();

		// Validate image file format if provided
		if (imageFile != null && imageFile.Length > 0)
		{
			var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png" };
			if (!allowedTypes.Contains(imageFile.ContentType.ToLower()))
				return BadRequest("Only JPEG, JPG and PNG images are allowed");

			// Validate file size (5MB max)
			if (imageFile.Length > 5 * 1024 * 1024)
				return BadRequest("Image size must be less than 5MB");

			using var memoryStream = new MemoryStream();
			await imageFile.CopyToAsync(memoryStream);
			var imageBytes = memoryStream.ToArray();

			property.Image = imageBytes;
		}

		var createdProperty = await _propertyRepository.AddAsync(property);

		return CreatedAtAction(
				nameof(GetById),
				new { id = createdProperty.IdProperty },
				createdProperty.ToDto());
	}

	/// <summary>
	/// Update an existing property
	/// </summary>
	/// <param name="id">The property's unique identifier</param>
	/// <param name="propertyDto">The updated property data</param>
	/// <param name="imageFile">The property image file</param>
	/// <returns>The updated property</returns>
	/// <response code="200">Returns the updated property</response>
	/// <response code="400">If the property data is invalid</response>
	/// <response code="404">If the property or owner is not found</response>
	[HttpPut("{id}")]
	[ProducesResponseType(typeof(PropertyDto), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<ActionResult<PropertyDto>> Update(
		[Required] string id,
		[FromForm][Required] PropertyCreateOrUpdateDto propertyDto,
		IFormFile? imageFile)
	{
		if (!ModelState.IsValid)
			return BadRequest(ModelState);

		var existingProperty = await _propertyRepository.GetByIdAsync(id);
		if (existingProperty == null)
			return NotFound($"Property with ID {id} not found");

		// Validate that the Owner exists
		var ownerExists = await _ownerRepository.GetByIdAsync(propertyDto.IdOwner);
		if (ownerExists == null)
			return NotFound($"Owner with ID {propertyDto.IdOwner} does not exist");
		// Update basic properties from DTO
		existingProperty.IdOwner = propertyDto.IdOwner;
		existingProperty.Name = propertyDto.Name;
		existingProperty.Address = propertyDto.Address;
		existingProperty.Price = propertyDto.Price;

		if (imageFile != null && imageFile.Length > 0)
		{
			var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png" };
			if (!allowedTypes.Contains(imageFile.ContentType.ToLower()))
				return BadRequest("Only JPEG, JPG and PNG images are allowed");

			// Validate file size (5MB max)
			if (imageFile.Length > 5 * 1024 * 1024)
				return BadRequest("Image size must be less than 5MB");

			using var memoryStream = new MemoryStream();
			await imageFile.CopyToAsync(memoryStream);
			var imageBytes = memoryStream.ToArray();

			existingProperty.Image = imageBytes;
		}

		var updatedProperty = await _propertyRepository.UpdateAsync(existingProperty);
		return Ok(updatedProperty.ToDto());
	}

	/// <summary>
	/// Delete a property and its associated image
	/// </summary>
	/// <param name="id">The property's unique identifier</param>
	/// <returns>No content if successful</returns>
	/// <response code="204">Property and image successfully deleted</response>
	/// <response code="400">If there's an error deleting the property</response>
	/// <response code="404">If the property is not found</response>
	[HttpDelete("{id}")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<IActionResult> Delete([Required] string id)
	{
		var property = await _propertyRepository.GetByIdAsync(id);
		if (property == null)
			return NotFound($"Property with ID {id} not found");

		var deleted = await _propertyRepository.DeleteAsync(id);
		if (!deleted)
			return BadRequest("Failed to delete property");

		return NoContent();
	}
}