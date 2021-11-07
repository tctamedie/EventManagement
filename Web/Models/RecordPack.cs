using Relational.BaseModels.AspNetCore.Generics.Annotations;

namespace Web.Models
{
    public class RecordPack
    {
        public object Record { get; set; }
        public FormModel Model { get; set; }
    }
}
