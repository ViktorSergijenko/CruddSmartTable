using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TESTAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;

namespace TESTAPI
{

  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }
    public IConfiguration Configuration { get; }
    public void ConfigureServices(IServiceCollection services)
    {

      services.AddDbContext<HouseContext>(options =>
     options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

         //.AddJsonOptions(o => o.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
      //services.AddCors(options =>
      //{
      //  options.AddPolicy("AllowAnyOrigin",
      //      builder => builder
      //      .AllowAnyOrigin()
      //      .AllowAnyMethod()
      //      .AllowAnyHeader()

      //      );
      //});
      //);
      services.AddMvc()
      .AddJsonOptions(x =>
       {
         x.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
         x.SerializerSettings.DateFormatHandling = DateFormatHandling.IsoDateFormat;
         x.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
         x.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;

       });
    }

    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {

      app.UseMvc();

      app.UseCors("AllowAnyOrigin");
    }
  }
}
