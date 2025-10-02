using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace properties_app_backend.Models;

public class PropertyDto
{
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? IdProperty { get; set; }

	[Required(ErrorMessage = "Owner ID is required")]
	public string IdOwner { get; set; } = string.Empty;

	[Required(ErrorMessage = "Property name is required")]
	[StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
	public string Name { get; set; } = string.Empty;

	[Required(ErrorMessage = "Address is required")]
	[StringLength(200, ErrorMessage = "Address cannot exceed 200 characters")]
	public string Address { get; set; } = string.Empty;

	[Required(ErrorMessage = "Price is required")]
	[Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
	public decimal Price { get; set; }
	public byte[]? Image { get; set; }
}

public class PropertyCreateOrUpdateDto
{
	[Required(ErrorMessage = "Owner ID is required")]
	public string IdOwner { get; set; } = string.Empty;

	[Required(ErrorMessage = "Property name is required")]
	[StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
	public string Name { get; set; } = string.Empty;

	[Required(ErrorMessage = "Address is required")]
	[StringLength(200, ErrorMessage = "Address cannot exceed 200 characters")]
	public string Address { get; set; } = string.Empty;

	[Required(ErrorMessage = "Price is required")]
	[Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
	public decimal Price { get; set; }
}