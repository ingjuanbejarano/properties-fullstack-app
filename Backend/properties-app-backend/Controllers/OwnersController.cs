using Microsoft.AspNetCore.Mvc;
using properties_app_backend.Extensions;
using properties_app_backend.Models;
using properties_app_backend.Repositories;
using System.ComponentModel.DataAnnotations;

namespace properties_app_backend.Controllers;

/// <summary>
/// Controller for managing property owners
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class OwnersController : ControllerBase
{
	private readonly IOwnerRepository _ownerRepository;

	public OwnersController(IOwnerRepository ownerRepository)
	{
		_ownerRepository = ownerRepository;
	}

	/// <summary>
	/// Get all property owners
	/// </summary>
	/// <returns>List of all owners</returns>
	/// <response code="200">Returns the list of owners</response>
	[HttpGet]
	[ProducesResponseType(typeof(IEnumerable<OwnerDto>), StatusCodes.Status200OK)]
	public async Task<ActionResult<IEnumerable<OwnerDto>>> GetAll()
	{
		var owners = await _ownerRepository.GetAllAsync();
		var ownerDtos = owners.Select(o => o.ToDto());
		return Ok(ownerDtos);
	}

	/// <summary>
	/// Get a specific owner by ID
	/// </summary>
	/// <param name="id">The owner's unique identifier</param>
	/// <returns>The owner details</returns>
	/// <response code="200">Returns the owner</response>
	/// <response code="404">If the owner is not found</response>
	[HttpGet("{id}")]
	[ProducesResponseType(typeof(OwnerDto), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<ActionResult<OwnerDto>> GetById([Required] string id)
	{
		var owner = await _ownerRepository.GetByIdAsync(id);
		if (owner == null)
			return NotFound($"Owner with ID {id} not found");

		return Ok(owner.ToDto());
	}

	/// <summary>
	/// Create a new property owner
	/// </summary>
	/// <param name="ownerCreateDto">The owner data to create</param>
	/// <returns>The created owner</returns>
	/// <response code="201">Returns the newly created owner</response>
	/// <response code="400">If the owner data is invalid</response>
	[HttpPost]
	[ProducesResponseType(typeof(OwnerDto), StatusCodes.Status201Created)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	public async Task<ActionResult<OwnerDto>> Create([FromBody][Required] OwnerCreateOrUpdateDto ownerCreateDto)
	{
		if (!ModelState.IsValid)
			return BadRequest(ModelState);

		var owner = ownerCreateDto.ToEntity();
		var createdOwner = await _ownerRepository.AddAsync(owner);

		return CreatedAtAction(
				nameof(GetById),
				new { id = createdOwner.IdOwner },
				createdOwner.ToDto());
	}

	/// <summary>
	/// Update an existing property owner
	/// </summary>
	/// <param name="id">The owner's unique identifier</param>
	/// <param name="ownerDto">The updated owner data</param>
	/// <returns>The updated owner</returns>
	/// <response code="200">Returns the updated owner</response>
	/// <response code="400">If the owner data is invalid</response>
	/// <response code="404">If the owner is not found</response>
	[HttpPut("{id}")]
	[ProducesResponseType(typeof(OwnerDto), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	public async Task<ActionResult<OwnerDto>> Update([Required] string id, [FromBody][Required] OwnerCreateOrUpdateDto ownerDto)
	{
		if (!ModelState.IsValid)
			return BadRequest(ModelState);

		var existingOwner = await _ownerRepository.GetByIdAsync(id);
		if (existingOwner == null)
			return NotFound($"Owner with ID {id} not found");

		// Update properties
		existingOwner.Name = ownerDto.Name;
		existingOwner.Address = ownerDto.Address;

		var updatedOwner = await _ownerRepository.UpdateAsync(existingOwner);
		return Ok(updatedOwner.ToDto());
	}

	/// <summary>
	/// Delete a property owner
	/// </summary>
	/// <param name="id">The owner's unique identifier</param>
	/// <returns>No content if successful</returns>
	/// <response code="204">Owner successfully deleted</response>
	/// <response code="404">If the owner is not found</response>
	[HttpDelete("{id}")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	[ProducesResponseType(StatusCodes.Status409Conflict)]
	public async Task<IActionResult> Delete([Required] string id)
	{
		var owner = await _ownerRepository.GetByIdAsync(id);
		if (owner == null)
			return NotFound($"Owner with ID {id} not found");

		// Check if owner has properties
		if (owner.Properties != null && owner.Properties.Any())
			return Conflict("Cannot delete owner because they have associated properties");

		var deleted = await _ownerRepository.DeleteAsync(id);
		if (!deleted)
			return Problem("Could not delete Owner", statusCode: 500);

		return NoContent();
	}
}