using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace properties_app_backend.Entities
{
	public class Property
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string IdProperty { get; set; } = ObjectId.GenerateNewId().ToString();

		[Required]
		[BsonElement("idOwner")]
		// Navigation property for Owner
		public string IdOwner { get; set; } = string.Empty;
		[BsonIgnore]
		public virtual Owner? Owner { get; set; }

		[Required]
		[BsonElement("name")]
		public string Name { get; set; } = string.Empty;

		[Required]
		[BsonElement("address")]
		public string Address { get; set; } = string.Empty;

		[Required]
		[BsonElement("price")]
		public decimal Price { get; set; }

		[BsonElement("image")]
		public byte[]? Image { get; set; }
	}
}