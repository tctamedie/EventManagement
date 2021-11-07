using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Models;
using Relational.BaseModels.AspNetCore.Generics;
using Relational.BaseModels.AspNetCore.Generics.Annotations;
using Relational.BaseModels.AspNetCore.Generics.Services;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Web.Models;

namespace Sample.Portal.Controllers
{
    public class RecordController<TEntity, TMap, T, TFilter> : Controller
        where TEntity : Record<T>
        where TMap : RecordDto<T>
        where T : IEquatable<T>
        where TFilter : RecordFilter
    {
        protected readonly IRecordService<TEntity, TMap, T,EventContext, TFilter> _repository;
        protected readonly ILogger<IRecordService<TEntity, TMap, T, EventContext, TFilter>> _logger;
        public RecordController(IRecordService<TEntity, TMap, T, EventContext, TFilter> repository, ILogger<IRecordService<TEntity, TMap, T, EventContext, TFilter>> logger)
        {
            _repository = repository;
            _logger = logger;
            _repository.SecurityDetail.IsMaker = true;

        }
        public JsonResult GetUI(string id = "")
        {
            return Json(_repository.GetTableModel(id));
        }
        protected virtual Task<List<TEntity>> ReadDataAsync(TFilter filter)
        {
            return _repository.ReadAsync(filter);
        }
        public virtual List<BreadCrumb> CreateBreadCrumbs(string id, TFilter filter, List<BreadCrumb> breadCrumbs)
        {
            return breadCrumbs;
        }
        public BreadCrumb CreateBreadCrumb(BreadCrumb breadCrumb, string header, string prependHeader, string recordId)
        {
            breadCrumb.Header = header;
            breadCrumb.PrependHeader = prependHeader;
            breadCrumb.RecordID = recordId;
            return breadCrumb;
        }
        public virtual void SetFilterValue(TFilter filter, string id)
        {

        }
        void SetTableFilterValue(string id, TableModel model, string filterColumn = "")
        {
            if (string.IsNullOrEmpty(filterColumn))
                return;
            model.ForeignKey = filterColumn.FirstLetterToLower();
            var filterKey = $"filter{filterColumn}";
            model.Filters.ForEach(s =>
            {
                if (s.Id == filterKey)
                {
                    s.DefaultValue = id;
                }
            });
        }

        [HttpPost]
        public virtual async Task<JsonResult> GetTableModel(string id, TFilter filter, string filterColumn)
        {
            DataPack pack = new();
            try
            {
                var model = _repository.GetTableModel(id);
                model.IsCreator = true;
                SetFilterValue(filter, id);
                SetTableFilterValue(id, model, filterColumn);
                model.BreadCrumbs = CreateBreadCrumbs(id, filter, new List<BreadCrumb>());
                var records = await ReadDataAsync(filter);
                pack = new()
                {
                    Records = records,
                    Model = model
                };
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return Json(pack);
            }

            return Json(pack);
        }
        public IActionResult Index(string id = "")
        {
            return PartialView("_Index");
        }
        [HttpPost]
        public async Task<JsonResult> Search(TFilter filter = null)
        {
            try
            {
                return Json(await _repository.ReadAsync(filter));
            }
            catch (Exception e)
            {

                return HandleException(e);
            }
        }
        public async Task<JsonResult> ReadAsync(TFilter filter)
        {
            try
            {
                var data = await _repository.ReadAsync(filter);
                return Json(data);
            }
            catch (Exception e)
            {

                return HandleException(e);
            }

        }

        public async Task<JsonResult> ReadData(TFilter filter)
        {
            try
            {
                var data = await _repository.ReadAsync(filter);
                return Json(data);
            }
            catch (Exception e)
            {

                return HandleException(e);
            }

        }
        public IActionResult Create(string id)
        {
            return PartialView("_Create");
        }
        public IActionResult Edit(T id)
        {

            return PartialView("_Edit");
        }
        public virtual JsonResult BooleanList(string trueCondition = "True", string falseCondition = "False")
        {
            return Json(new List<object>{
            new {Id=true, Name=trueCondition},
            new {Id=false, Name=falseCondition},
            });
        }
        public JsonResult GetRecordStatus()
        {
            return Json(new List<object> {
            new {Id="A", Name="Approved"},
            new {Id="P", Name="Pending"},
            new {Id="U", Name="Unapproved"},
            });
        }
        public IActionResult Details(T id)
        {
            return PartialView("_Details");
        }
        public virtual JsonResult GetFormModel(string id = "", string filterColumn = "")
        {
            var model = _repository.GetFormModel(id);
            CreateFormModelFilter(model, id, filterColumn);
            return Json(model);
        }
        void CreateFormModelFilter(FormModel model, string parentID = "", string filterColumn = "")
        {
            if (string.IsNullOrEmpty(parentID) || string.IsNullOrEmpty(filterColumn))
                return;
            model.Tabs.ForEach(tab =>
            {
                tab.Rows.ForEach(row =>
                {
                    row.Fields.ForEach(f =>
                    {
                        if (f.Id.ToLower() == filterColumn.ToLower())
                        {
                            f.DefaultValue = parentID;
                        }
                    });
                });
            });
        }
        public JsonResult Find(T id, string parentID = "")
        {
            var record = _repository.Find(id);
            var model = _repository.GetFormModel(parentID);
            RecordPack pack = new()
            {
                Model = model,
                Record = record
            };
            return Json(pack);
        }
        protected virtual object CreateObjectValues(TEntity row)
        {
            return null;
        }
        public IActionResult Delete(T id)
        {

            return PartialView("_Delete");
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(TMap row)
        {
            try
            {
                var record = await _repository.AddAsync(row,"User" );
                var routeData = CreateObjectValues((TEntity)record.Data);
                return RedirectToAction("Index", routeData);
            }
            catch (Exception e)
            {

                return HandleException(e);
            }

        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(T id, TMap row)
        {
            try
            {
                var record = _repository.UpdateAsync( row, "User");
                return PartialView("_Index");
            }
            catch (Exception e)
            {
                return HandleException(e);
            }

        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult Delete(T id, TMap row)
        {
            try
            {
                var record = _repository.DeleteAsync(id, "Deleter");
                return Json(record);
            }
            catch (Exception e)
            {
                return HandleException(e);
            }

        }
        public IActionResult Approve()
        {
            return PartialView("_Approve");
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Approve(T id)
        {
            try
            {
                var record = _repository.ApproveAsync(id, "Approver");
                return PartialView("_Index");
            }
            catch (Exception e)
            {
                return HandleException(e);
            }

        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Reject(T id)
        {
            try
            {
                var record = _repository.RejectAsync(id, "Rejector");
                return PartialView("_Index");
            }
            catch (Exception e)
            {
                return HandleException(e);
            }

        }
        protected JsonResult HandleException(Exception e, [CallerMemberName] string caller = "")
        {
            _logger.LogError(e, $"An Error Occurred while performing {caller} operation");
            return Json(new { Method = caller, Message = $"An Error Occurred while performing {caller} operation" });
        }
    }
}
