using properties_app_backend.Entities;
using MongoDB.Bson;

namespace properties_app_backend.Tests.TestData;

/// <summary>
/// Builder class for creating test data objects
/// </summary>
public static class TestDataBuilder
{
	public static class Owners
	{
		public static Owner CreateDefault()
		{
			return new Owner
			{
				IdOwner = ObjectId.GenerateNewId().ToString(),
				Name = "Test Owner",
				Address = "123 Test Street"
			};
		}

		public static Owner CreateWithName(string name)
		{
			return new Owner
			{
				IdOwner = ObjectId.GenerateNewId().ToString(),
				Name = name,
				Address = "123 Test Street"
			};
		}

		public static Owner CreateComplete(string name, string address)
		{
			return new Owner
			{
				IdOwner = ObjectId.GenerateNewId().ToString(),
				Name = name,
				Address = address
			};
		}

		public static List<Owner> CreateMultiple(int count)
		{
			var owners = new List<Owner>();
			for (int i = 1; i <= count; i++)
			{
				owners.Add(new Owner
				{
					IdOwner = ObjectId.GenerateNewId().ToString(),
					Name = $"Owner {i}",
					Address = $"{i}00 Test Street"
				});
			}
			return owners;
		}
	}

	public static class Properties
	{
		public static Property CreateDefault()
		{
			return new Property
			{
				IdProperty = ObjectId.GenerateNewId().ToString(),
				IdOwner = ObjectId.GenerateNewId().ToString(),
				Name = "Test Property",
				Address = "456 Property Street",
				Price = 100000m
			};
		}

		public static Property CreateWithOwner(string ownerId)
		{
			return new Property
			{
				IdProperty = ObjectId.GenerateNewId().ToString(),
				IdOwner = ownerId,
				Name = "Test Property",
				Address = "456 Property Street",
				Price = 100000m
			};
		}

		public static Property CreateComplete(string name, string address, decimal price, string ownerId)
		{
			return new Property
			{
				IdProperty = ObjectId.GenerateNewId().ToString(),
				IdOwner = ownerId,
				Name = name,
				Address = address,
				Price = price
			};
		}

		public static List<Property> CreateMultiple(int count, string? ownerId = null)
		{
			var properties = new List<Property>();
			for (int i = 1; i <= count; i++)
			{
				properties.Add(new Property
				{
					IdProperty = ObjectId.GenerateNewId().ToString(),
					IdOwner = ownerId ?? ObjectId.GenerateNewId().ToString(),
					Name = $"Property {i}",
					Address = $"{i}00 Property Street",
					Price = 100000m * i
				});
			}
			return properties;
		}

		public static Property CreateWithPrice(decimal price)
		{
			return new Property
			{
				IdProperty = ObjectId.GenerateNewId().ToString(),
				IdOwner = ObjectId.GenerateNewId().ToString(),
				Name = "Test Property",
				Address = "456 Property Street",
				Price = price
			};
		}
	}
}