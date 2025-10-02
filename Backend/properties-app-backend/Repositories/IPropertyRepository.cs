using properties_app_backend.Entities;

namespace properties_app_backend.Repositories;

public interface IPropertyRepository
{
	Task<IEnumerable<Property>> GetAllAsync();
	Task<IEnumerable<Property>> GetAllWithFiltersAsync(string? name = null, string? address = null, decimal? minPrice = null, decimal? maxPrice = null);
	Task<Property?> GetByIdAsync(string id);
	Task<Property> AddAsync(Property entity);
	Task<Property> UpdateAsync(Property entity);
	Task<bool> DeleteAsync(string id);
}