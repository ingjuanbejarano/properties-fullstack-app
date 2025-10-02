using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace properties_app_backend.Models;

public class OwnerDto
{
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? IdOwner { get; set; }

	[Required(ErrorMessage = "Name is required")]
	[StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
	public string Name { get; set; } = string.Empty;

	[Required(ErrorMessage = "Address is required")]
	[StringLength(200, ErrorMessage = "Address cannot exceed 200 characters")]
	public string Address { get; set; } = string.Empty;

	public List<PropertyDto>? Properties { get; set; }
}

public class OwnerCreateOrUpdateDto
{
	[Required(ErrorMessage = "Name is required")]
	[StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
	public string Name { get; set; } = string.Empty;

	[Required(ErrorMessage = "Address is required")]
	[StringLength(200, ErrorMessage = "Address cannot exceed 200 characters")]
	public string Address { get; set; } = string.Empty;
}