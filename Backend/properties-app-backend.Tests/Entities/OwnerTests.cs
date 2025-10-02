using NUnit.Framework;
using properties_app_backend.Entities;
using MongoDB.Bson;

namespace properties_app_backend.Tests.Entities;

[TestFixture]
public class OwnerTests
{
	[Test]
	public void Owner_Constructor_ShouldGenerateValidId()
	{
		// Arrange & Act
		var owner = new Owner();

		// Assert
		Assert.That(owner.IdOwner, Is.Not.Null);
		Assert.That(owner.IdOwner, Is.Not.Empty);
		Assert.That(ObjectId.TryParse(owner.IdOwner, out _), Is.True, "IdOwner should be a valid ObjectId");
	}

	[Test]
	public void Owner_Constructor_ShouldInitializeDefaultValues()
	{
		// Arrange & Act
		var owner = new Owner();

		// Assert
		Assert.That(owner.Name, Is.EqualTo(string.Empty));
		Assert.That(owner.Address, Is.EqualTo(string.Empty));
		Assert.That(owner.Properties, Is.Not.Null);
		Assert.That(owner.Properties, Is.Empty);
		Assert.That(owner.Properties, Is.InstanceOf<List<Property>>());
	}

	[Test]
	public void Owner_SetProperties_ShouldAssignValuesCorrectly()
	{
		// Arrange
		var owner = new Owner();
		var testName = "María González";
		var testAddress = "789 Avenida Central";

		// Act
		owner.Name = testName;
		owner.Address = testAddress;

		// Assert
		Assert.That(owner.Name, Is.EqualTo(testName));
		Assert.That(owner.Address, Is.EqualTo(testAddress));
	}

	[Test]
	public void Owner_Properties_ShouldAllowAddingProperties()
	{
		// Arrange
		var owner = new Owner
		{
			Name = "Carlos Rodriguez",
			Address = "321 Calle Norte"
		};

		var property1 = new Property
		{
			IdOwner = owner.IdOwner,
			Name = "Casa 1",
			Address = "123 Calle A",
			Price = 100000m
		};

		var property2 = new Property
		{
			IdOwner = owner.IdOwner,
			Name = "Casa 2",
			Address = "456 Calle B",
			Price = 200000m
		};

		// Act
		owner.Properties.Add(property1);
		owner.Properties.Add(property2);

		// Assert
		Assert.That(owner.Properties.Count, Is.EqualTo(2));
		Assert.That(owner.Properties.Contains(property1), Is.True);
		Assert.That(owner.Properties.Contains(property2), Is.True);
		Assert.That(owner.Properties.First().IdOwner, Is.EqualTo(owner.IdOwner));
	}

	[Test]
	public void Owner_GeneratesUniqueIds_ForMultipleInstances()
	{
		// Arrange & Act
		var owner1 = new Owner();
		var owner2 = new Owner();

		// Assert
		Assert.That(owner1.IdOwner, Is.Not.EqualTo(owner2.IdOwner),
				"Each Owner instance should have a unique ID");
	}

	[Test]
	public void Owner_PropertiesCollection_ShouldBeModifiable()
	{
		// Arrange
		var owner = new Owner();
		var property = new Property
		{
			Name = "Test Property",
			Address = "Test Address",
			Price = 50000m
		};

		// Act & Assert - Should not throw exception
		Assert.DoesNotThrow(() => owner.Properties.Add(property));
		Assert.DoesNotThrow(() => owner.Properties.Remove(property));
		Assert.DoesNotThrow(() => owner.Properties.Clear());
	}
}