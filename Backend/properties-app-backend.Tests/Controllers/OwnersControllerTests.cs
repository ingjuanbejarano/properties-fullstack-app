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
public class OwnersControllerTests
{
	private Mock<IOwnerRepository> _mockOwnerRepository = null!;
	private OwnersController _controller = null!;

	[SetUp]
	public void Setup()
	{
		_mockOwnerRepository = new Mock<IOwnerRepository>();
		_controller = new OwnersController(_mockOwnerRepository.Object);
	}

	[Test]
	public async Task GetAll_WhenNoOwners_ReturnsEmptyList()
	{
		// Arrange
		_mockOwnerRepository
				.Setup(repo => repo.GetAllAsync())
				.ReturnsAsync(new List<Owner>());

		// Act
		var result = await _controller.GetAll();

		// Assert
		Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
		var okResult = result.Result as OkObjectResult;
		Assert.That(okResult, Is.Not.Null);

		var owners = okResult!.Value as IEnumerable<OwnerDto>;
		Assert.That(owners, Is.Not.Null);
		Assert.That(owners!.Count(), Is.EqualTo(0));
	}

	[Test]
	public async Task GetAll_WhenOwnersExist_ReturnsOwnersList()
	{
		// Arrange
		var testOwners = new List<Owner>
				{
						new Owner
						{
								IdOwner = ObjectId.GenerateNewId().ToString(),
								Name = "Juan Pérez",
								Address = "123 Calle Principal"
						},
						new Owner
						{
								IdOwner = ObjectId.GenerateNewId().ToString(),
								Name = "María González",
								Address = "456 Avenida Central"
						}
				};

		_mockOwnerRepository
				.Setup(repo => repo.GetAllAsync())
				.ReturnsAsync(testOwners);

		// Act
		var result = await _controller.GetAll();

		// Assert
		Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
		var okResult = result.Result as OkObjectResult;
		var owners = okResult!.Value as IEnumerable<OwnerDto>;
		Assert.That(owners!.Count(), Is.EqualTo(2));
	}

	[Test]
	public async Task GetById_WhenOwnerExists_ReturnsOwner()
	{
		// Arrange
		var ownerId = ObjectId.GenerateNewId().ToString();
		var testOwner = new Owner
		{
			IdOwner = ownerId,
			Name = "Carlos Rodriguez",
			Address = "789 Calle Norte"
		};

		_mockOwnerRepository
				.Setup(repo => repo.GetByIdAsync(ownerId))
				.ReturnsAsync(testOwner);

		// Act
		var result = await _controller.GetById(ownerId);

		// Assert
		Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
		var okResult = result.Result as OkObjectResult;
		var owner = okResult!.Value as OwnerDto;
		Assert.That(owner, Is.Not.Null);
		Assert.That(owner!.IdOwner, Is.EqualTo(ownerId));
		Assert.That(owner.Name, Is.EqualTo("Carlos Rodriguez"));
	}

	[Test]
	public async Task GetById_WhenOwnerNotFound_ReturnsNotFound()
	{
		// Arrange
		var ownerId = ObjectId.GenerateNewId().ToString();
		_mockOwnerRepository
				.Setup(repo => repo.GetByIdAsync(ownerId))
				.ReturnsAsync((Owner?)null);

		// Act
		var result = await _controller.GetById(ownerId);

		// Assert
		Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
		var notFoundResult = result.Result as NotFoundObjectResult;
		Assert.That(notFoundResult!.Value!.ToString(), Does.Contain(ownerId));
	}

	[Test]
	public async Task GetAll_CallsRepositoryOnce()
	{
		// Arrange
		_mockOwnerRepository
				.Setup(repo => repo.GetAllAsync())
				.ReturnsAsync(new List<Owner>());

		// Act
		await _controller.GetAll();

		// Assert
		_mockOwnerRepository.Verify(repo => repo.GetAllAsync(), Times.Once);
	}

	[Test]
	public async Task GetById_CallsRepositoryWithCorrectId()
	{
		// Arrange
		var ownerId = ObjectId.GenerateNewId().ToString();
		_mockOwnerRepository
				.Setup(repo => repo.GetByIdAsync(ownerId))
				.ReturnsAsync((Owner?)null);

		// Act
		await _controller.GetById(ownerId);

		// Assert
		_mockOwnerRepository.Verify(repo => repo.GetByIdAsync(ownerId), Times.Once);
	}

	[Test]
	public void Controller_Constructor_ShouldInitializeDependencies()
	{
		// Arrange & Act
		var controller = new OwnersController(_mockOwnerRepository.Object);

		// Assert
		Assert.That(controller, Is.Not.Null);
		Assert.DoesNotThrow(() => new OwnersController(_mockOwnerRepository.Object));
	}

	[Test]
	public async Task Delete_WhenOwnerExists_ReturnsNoContent()
	{
		// Arrange
		var ownerId = ObjectId.GenerateNewId().ToString();
		var testOwner = new Owner
		{
			IdOwner = ownerId,
			Name = "Carlos Rodriguez",
			Address = "789 Calle Norte",
			Properties = new List<Property>() // No properties
		};

		_mockOwnerRepository
			.Setup(repo => repo.GetByIdAsync(ownerId))
			.ReturnsAsync(testOwner);
		_mockOwnerRepository
			.Setup(repo => repo.DeleteAsync(ownerId))
			.ReturnsAsync(true);

		// Act
		var result = await _controller.Delete(ownerId);

		// Assert
		Assert.That(result, Is.InstanceOf<NoContentResult>());
		_mockOwnerRepository.Verify(repo => repo.DeleteAsync(ownerId), Times.Once);
	}

	[Test]
	public async Task Delete_WhenOwnerNotFound_ReturnsNotFound()
	{
		// Arrange
		var ownerId = ObjectId.GenerateNewId().ToString();
		_mockOwnerRepository
			.Setup(repo => repo.GetByIdAsync(ownerId))
			.ReturnsAsync((Owner?)null);

		// Act
		var result = await _controller.Delete(ownerId);

		// Assert
		Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
		var notFoundResult = result as NotFoundObjectResult;
		Assert.That(notFoundResult!.Value!.ToString(), Does.Contain(ownerId));
		_mockOwnerRepository.Verify(repo => repo.DeleteAsync(It.IsAny<string>()), Times.Never);
	}

	[Test]
	public async Task Delete_WhenOwnerHasProperties_ReturnsConflict()
	{
		// Arrange
		var ownerId = ObjectId.GenerateNewId().ToString();
		var testOwner = new Owner
		{
			IdOwner = ownerId,
			Name = "Maria Gonzalez",
			Address = "456 Avenida Central",
			Properties = new List<Property>
			{
				new Property
				{
					IdProperty = ObjectId.GenerateNewId().ToString(),
					Name = "Casa de Maria",
					Address = "456 Avenida Central",
					Price = 150000,
					IdOwner = ownerId
				}
			}
		};

		_mockOwnerRepository
			.Setup(repo => repo.GetByIdAsync(ownerId))
			.ReturnsAsync(testOwner);

		// Act
		var result = await _controller.Delete(ownerId);

		// Assert
		Assert.That(result, Is.InstanceOf<ConflictObjectResult>());
		var conflictResult = result as ConflictObjectResult;
		Assert.That(conflictResult!.Value!.ToString(), Does.Contain("Cannot delete owner because they have associated properties"));
		_mockOwnerRepository.Verify(repo => repo.DeleteAsync(It.IsAny<string>()), Times.Never);
	}

	[Test]
	public async Task Delete_WhenDeleteFails_ReturnsInternalServerError()
	{
		// Arrange
		var ownerId = ObjectId.GenerateNewId().ToString();
		var testOwner = new Owner
		{
			IdOwner = ownerId,
			Name = "Carlos Rodriguez",
			Address = "789 Calle Norte",
			Properties = new List<Property>()
		};

		_mockOwnerRepository
			.Setup(repo => repo.GetByIdAsync(ownerId))
			.ReturnsAsync(testOwner);
		_mockOwnerRepository
			.Setup(repo => repo.DeleteAsync(ownerId))
			.ReturnsAsync(false); // Simula fallo en la eliminación

		// Act
		var result = await _controller.Delete(ownerId);

		// Assert
		Assert.That(result, Is.InstanceOf<ObjectResult>());
		var objectResult = result as ObjectResult;
		Assert.That(objectResult!.StatusCode, Is.EqualTo(500));

		// Verificar que el objeto es ProblemDetails y contiene el mensaje esperado
		var problemDetails = objectResult.Value as ProblemDetails;
		Assert.That(problemDetails, Is.Not.Null);
		Assert.That(problemDetails!.Detail, Does.Contain("Could not delete Owner"));
	}
}