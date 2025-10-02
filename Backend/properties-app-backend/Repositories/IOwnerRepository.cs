using properties_app_backend.Entities;

namespace properties_app_backend.Repositories;

public interface IOwnerRepository
{
	Task<IEnumerable<Owner>> GetAllAsync();
	Task<Owner?> GetByIdAsync(string id);
	Task<Owner> AddAsync(Owner entity);
	Task<Owner> UpdateAsync(Owner entity);
	Task<bool> DeleteAsync(string id);
}