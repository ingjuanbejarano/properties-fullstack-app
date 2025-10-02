using NUnit.Framework;
using properties_app_backend.Entities;
using MongoDB.Bson;

namespace properties_app_backend.Tests.Entities;

[TestFixture]
public class PropertyTests
{
	[Test]
	public void Property_Constructor_ShouldGenerateValidId()
	{
		// Arrange & Act
		var property = new Property();

		// Assert
		Assert.That(property.IdProperty, Is.Not.Null);
		Assert.That(property.IdProperty, Is.Not.Empty);
		Assert.That(ObjectId.TryParse(property.IdProperty, out _), Is.True, "IdProperty should be a valid ObjectId");
	}

	[Test]
	public void Property_Constructor_ShouldInitializeDefaultValues()
	{
		// Arrange & Act
		var property = new Property();

		// Assert
		Assert.That(property.IdOwner, Is.EqualTo(string.Empty));
		Assert.That(property.Name, Is.EqualTo(string.Empty));
		Assert.That(property.Address, Is.EqualTo(string.Empty));
		Assert.That(property.Price, Is.EqualTo(0));
		Assert.That(property.Owner, Is.Null);
		Assert.That(property.Image, Is.Null);
	}

	[Test]
	public void Property_SetProperties_ShouldAssignValuesCorrectly()
	{
		// Arrange
		var property = new Property();
		var testIdOwner = ObjectId.GenerateNewId().ToString();
		var testName = "Casa de prueba";
		var testAddress = "123 Calle Principal";
		var testPrice = 150000m;

		// Act
		property.IdOwner = testIdOwner;
		property.Name = testName;
		property.Address = testAddress;
		property.Price = testPrice;

		// Assert
		Assert.That(property.IdOwner, Is.EqualTo(testIdOwner));
		Assert.That(property.Name, Is.EqualTo(testName));
		Assert.That(property.Address, Is.EqualTo(testAddress));
		Assert.That(property.Price, Is.EqualTo(testPrice));
	}

	[Test]
	public void Property_NavigationProperty_ShouldAllowOwnerAssignment()
	{
		// Arrange
		var property = new Property();
		var owner = new Owner
		{
			Name = "Juan Pérez",
			Address = "456 Calle Secundaria"
		};

		// Act
		property.Owner = owner;

		// Assert
		Assert.That(property.Owner, Is.Not.Null);
		Assert.That(property.Owner.Name, Is.EqualTo("Juan Pérez"));
		Assert.That(property.Owner.Address, Is.EqualTo("456 Calle Secundaria"));
	}

	[Test]
	public void Property_GeneratesUniqueIds_ForMultipleInstances()
	{
		// Arrange & Act
		var property1 = new Property();
		var property2 = new Property();

		// Assert
		Assert.That(property1.IdProperty, Is.Not.EqualTo(property2.IdProperty),
				"Each Property instance should have a unique ID");
	}
}