using Relational.BaseModels.AspNetCore.Generics.Annotations;
using System.Collections.Generic;

namespace Web.Models
{
    public class DataPack
    {
        public IEnumerable<object> Records { get; set; }
        public TableModel Model { get; set; }
    }
}
