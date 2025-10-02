using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace properties_app_backend.Entities
{
	public class Owner
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string IdOwner { get; set; } = ObjectId.GenerateNewId().ToString();

		[Required]
		[BsonElement("name")]
		public string Name { get; set; } = string.Empty;

		[Required]
		[BsonElement("address")]
		public string Address { get; set; } = string.Empty;

		// Navigation property for relationship with Properties
		[BsonIgnore] // Not saved in MongoDB, only for EF Core
		public virtual ICollection<Property> Properties { get; set; } = new List<Property>();
	}
}