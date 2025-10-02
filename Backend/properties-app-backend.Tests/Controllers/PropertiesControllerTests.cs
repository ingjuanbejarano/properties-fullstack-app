using NUnit.Framework;
using Moq;
using Microsoft.AspNetCore.Mvc;
using properties_app_backend.Controllers;
using properties_app_backend.Repositories;
using properties_app_backend.Entities;
using properties_app_backend.Models;
using MongoDB.Bson;

namespace properties_app_backend.Tests.Controllers;

[TestFixture]
public class PropertiesControllerTests
{
	private Mock<IPropertyRepository> _mockPropertyRepository = null!;
	private Mock<IOwnerRepository> _mockOwnerRepository = null!;
	private PropertiesController _controller = null!;

	[SetUp]
	public void Setup()
	{
		_mockPropertyRepository = new Mock<IPropertyRepository>();
		_mockOwnerRepository = new Mock<IOwnerRepository>();
		_controller = new PropertiesController(_mockPropertyRepository.Object, _mockOwnerRepository.Object);
	}

	[Test]
	public async Task GetAll_WhenNoProperties_ReturnsEmptyList()
	{
		// Arrange
		_mockPropertyRepository
				.Setup(repo => repo.GetAllWithFiltersAsync(null, null, null, null))
				.ReturnsAsync(new List<Property>());

		// Act
		var result = await _controller.GetAll();

		// Assert
		Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
		var okResult = result.Result as OkObjectResult;
		Assert.That(okResult, Is.Not.Null);

		var properties = okResult!.Value as IEnumerable<PropertyDto>;
		Assert.That(properties, Is.Not.Null);
		Assert.That(properties!.Count(), Is.EqualTo(0));
	}

	[Test]
	public async Task GetAll_WhenPropertiesExist_ReturnsPropertiesList()
	{
		// Arrange
		var testProperties = new List<Property>
				{
						new Property
						{
								IdProperty = ObjectId.GenerateNewId().ToString(),
								Name = "Casa de prueba",
								Address = "123 Calle Principal",
								Price = 150000m,
								IdOwner = ObjectId.GenerateNewId().ToString()
						},
						new Property
						{
								IdProperty = ObjectId.GenerateNewId().ToString(),
								Name = "Apartamento moderno",
								Address = "456 Avenida Central",
								Price = 200000m,
								IdOwner = ObjectId.GenerateNewId().ToString()
						}
				};

		_mockPropertyRepository
				.Setup(repo => repo.GetAllWithFiltersAsync(null, null, null, null))
				.ReturnsAsync(testProperties);

		// Act
		var result = await _controller.GetAll();

		// Assert
		Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
		var okResult = result.Result as OkObjectResult;
		var properties = okResult!.Value as IEnumerable<PropertyDto>;
		Assert.That(properties!.Count(), Is.EqualTo(2));
	}

	[Test]
	public async Task GetById_WhenPropertyExists_ReturnsProperty()
	{
		// Arrange
		var propertyId = ObjectId.GenerateNewId().ToString();
		var testProperty = new Property
		{
			IdProperty = propertyId,
			Name = "Casa de prueba",
			Address = "123 Calle Principal",
			Price = 150000m,
			IdOwner = ObjectId.GenerateNewId().ToString()
		};

		_mockPropertyRepository
				.Setup(repo => repo.GetByIdAsync(propertyId))
				.ReturnsAsync(testProperty);

		// Act
		var result = await _controller.GetById(propertyId);

		// Assert
		Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
		var okResult = result.Result as OkObjectResult;
		var property = okResult!.Value as PropertyDto;
		Assert.That(property, Is.Not.Null);
		Assert.That(property!.IdProperty, Is.EqualTo(propertyId));
		Assert.That(property.Name, Is.EqualTo("Casa de prueba"));
	}

	[Test]
	public async Task GetById_WhenPropertyNotFound_ReturnsNotFound()
	{
		// Arrange
		var propertyId = ObjectId.GenerateNewId().ToString();
		_mockPropertyRepository
				.Setup(repo => repo.GetByIdAsync(propertyId))
				.ReturnsAsync((Property?)null);

		// Act
		var result = await _controller.GetById(propertyId);

		// Assert
		Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
		var notFoundResult = result.Result as NotFoundObjectResult;
		Assert.That(notFoundResult!.Value!.ToString(), Does.Contain(propertyId));
	}

	[Test]
	public async Task GetAll_WithFilters_CallsRepositoryWithCorrectParameters()
	{
		// Arrange
		var name = "Casa";
		var address = "Calle";
		var minPrice = 100000m;
		var maxPrice = 300000m;

		_mockPropertyRepository
				.Setup(repo => repo.GetAllWithFiltersAsync(name, address, minPrice, maxPrice))
				.ReturnsAsync(new List<Property>());

		// Act
		await _controller.GetAll(name, address, minPrice, maxPrice);

		// Assert
		_mockPropertyRepository.Verify(
				repo => repo.GetAllWithFiltersAsync(name, address, minPrice, maxPrice),
				Times.Once);
	}

	[Test]
	public void Controller_Constructor_ShouldInitializeDependencies()
	{
		// Arrange & Act
		var controller = new PropertiesController(_mockPropertyRepository.Object, _mockOwnerRepository.Object);

		// Assert
		Assert.That(controller, Is.Not.Null);
		Assert.DoesNotThrow(() => new PropertiesController(_mockPropertyRepository.Object, _mockOwnerRepository.Object));
	}
}