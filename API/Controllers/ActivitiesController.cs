using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {        
        [HttpGet]
        [ProducesResponseType(typeof(List<Activity>),StatusCodes.Status200OK)]
        public async Task<ActionResult<List<Activity>>> GetActivities()        
        {            
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Activity), StatusCodes.Status200OK)]
        public async Task<ActionResult<Activity>> GetActivity(Guid id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }

        [HttpPost]        
        public async Task<IActionResult> CreateActivity(Activity activity)
        {            
            var response = await Mediator.Send(new Create.Command { Activity = activity });

            return Ok(response);
        }

        [HttpPut("{id}")]        
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;
            var response = await Mediator.Send(new Edit.Command { Activity = activity });
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            var response = await Mediator.Send(new Delete.Command { Id = id });
            return Ok(response);
        }
    }
}
