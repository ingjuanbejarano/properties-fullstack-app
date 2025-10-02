using properties_app_backend.Entities;
using properties_app_backend.Models;

namespace properties_app_backend.Extensions;

public static class MappingExtensions
{
	// Owner Mappings
	public static OwnerDto ToDto(this Owner owner)
	{
		return new OwnerDto
		{
			IdOwner = owner.IdOwner,
			Name = owner.Name,
			Address = owner.Address,
			Properties = owner.Properties?.Select(p => p.ToDto()).ToList() ?? new List<PropertyDto>()
		};
	}

	public static Owner ToEntity(this OwnerCreateOrUpdateDto dto)
	{
		var owner = new Owner
		{
			Name = dto.Name,
			Address = dto.Address
		};

		return owner;
	}

	// Property Mappings
	public static PropertyDto ToDto(this Property property)
	{
		return new PropertyDto
		{
			IdProperty = property.IdProperty,
			IdOwner = property.IdOwner,
			Name = property.Name,
			Address = property.Address,
			Price = property.Price,
			Image = property.Image
		};
	}

	public static Property ToEntity(this PropertyCreateOrUpdateDto dto)
	{
		var property = new Property
		{
			IdOwner = dto.IdOwner,
			Name = dto.Name,
			Address = dto.Address,
			Price = dto.Price,
		};

		return property;
	}
}