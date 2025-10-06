using Microsoft.EntityFrameworkCore;
using properties_app_backend.Context;
using properties_app_backend.Repositories;
using MongoDB.Driver;
using Microsoft.OpenApi.Models;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure CORS
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowFrontend", policy =>
	{
		policy.WithOrigins("http://localhost:3000", "https://localhost:3000") // Next.js default ports
				.AllowAnyMethod()
				.AllowAnyHeader()
				.AllowCredentials();
	});
});

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(setupAction =>
{
	setupAction.SwaggerDoc("v1", new OpenApiInfo
	{
		Title = "Properties App API",
		Version = "v1",
		Description = "API for managing properties and owners"
	});

	var xmlCommentsFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
	var xmlCommentsFullPath = Path.Combine(AppContext.BaseDirectory, xmlCommentsFile);
	setupAction.IncludeXmlComments(xmlCommentsFullPath);

	// Support for file uploads
	setupAction.MapType<IFormFile>(() => new OpenApiSchema
	{
		Type = "string",
		Format = "binary"
	});
});

// Configure Entity Framework Core with MongoDB
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
		options.UseMongoDB(connectionString!, "PropertiesApp"));

// Configure MongoDB and GridFS
builder.Services.AddSingleton<IMongoClient>(s => new MongoClient(connectionString));
builder.Services.AddScoped<IMongoDatabase>(s =>
		s.GetRequiredService<IMongoClient>().GetDatabase("PropertiesApp"));

// Configure Repositories
builder.Services.AddScoped<IOwnerRepository, OwnerRepository>();
builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();

var app = builder.Build();

// Always ensure database exists
using var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
await context.Database.EnsureCreatedAsync();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI(c =>
	{
		c.SwaggerEndpoint("/swagger/v1/swagger.json", "Properties App API v1");
		c.RoutePrefix = "swagger"; // Makes Swagger UI available at /swagger
	});

	// Seed development data
	await context.SeedDevelopmentDataAsync();

	Console.WriteLine("Database ensured and seed data applied.");
}

// Use CORS policy
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

// Add health check endpoint
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

// Map controllers
app.MapControllers();

app.Run();
