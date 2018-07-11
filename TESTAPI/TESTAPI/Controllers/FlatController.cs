using System;
using System.Collections.Generic;
using System.Linq;
using TESTAPI.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TESTAPI.Controllers
{
    [Route("api/[controller]")]//[controller]???
    [EnableCors("AllowAnyOrigin")]
  public class FlatController : Controller
    {
        private readonly HouseContext _context;

        public FlatController(HouseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Flat> GetAll()
        {
      var flats = _context.flats
          .Include(x => x.house)
          .Include(x => x.residents)
          .ToList();
      flats.ForEach(flat => flat.residentamount = flat.residents.Count);
      return flats;
    }

        [HttpGet("{id}", Name = "GetFlat")]
        public Flat GetById(long id)
        {
            return _context.flats
                .Include(x => x.house)
                .Include(x => x.residents)
                .FirstOrDefault(t => t.id == id);
        }

        [HttpGet("~/api/house/{houseId}/flats")]
        public IEnumerable<Flat> GetFlatsForHouse(long houseId)
        {
           var houseFlats = _context.flats
          .Where(x => x.houseid == houseId)
          .ToList();
          return houseFlats;
        }
        [HttpGet("~/api/house/{houseId}/residents")]
        public IEnumerable<Flat> GetResidentAmountForHouse(long houseId)
        {
          var houseFlats = _context.flats
         .Where(x => x.houseid == houseId)
         .ToList();
      houseFlats.ForEach(flat => flat.residentamount = flat.residentamount + flat.residentamount);
          return houseFlats;
        }


    [HttpPost]//metod dobavlenija novogo objekta v bazu
        public IActionResult Create([FromBody] Flat item)
        {
            if (item == null)
            {
                return BadRequest();
            }

            _context.flats.Add(item);
            _context.SaveChanges();
            return CreatedAtRoute("GetFlat", new { id = item.id }, item);
        }
        [HttpPut("{id}")]
        public IActionResult Update(long id, [FromBody] Flat item)
        {
            if (item == null || item.id != id)
            {
                return BadRequest();
            }

            var flat = _context.flats.FirstOrDefault(t => t.id == id);
            if (flat == null)
            {
                return NotFound();
            }

            flat.floor = item.floor;
            flat.number = item.number;
            flat.totalarea = item.totalarea;
            flat.livingspace = item.livingspace;
            flat.houseid = item.houseid;

            _context.flats.Update(flat);
            _context.SaveChanges();
            return new NoContentResult();
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            var flat = _context.flats.FirstOrDefault(t => t.id == id);
            if (flat == null)
            {
                return NotFound();
            }

            _context.flats.Remove(flat);
            _context.SaveChanges();
            return new NoContentResult();
        }
    }
}
