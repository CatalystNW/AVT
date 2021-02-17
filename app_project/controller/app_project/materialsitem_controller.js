var WorkItem = require("../../models/app_project/WorkItem"),
    MaterialsItem = require("../../models/app_project/MaterialsItem");

module.exports.create_materialsitem = create_materialsitem;
module.exports.delete_materialsitem = delete_materialsitem;
module.exports.edit_materialsitem = edit_materialsitem;

async function create_materialsitem(req, res) {
  if (!req.body.workitem_id) {
    res.status(400).end();
    return;
  }
  var workitem = await WorkItem.findById(req.body.workitem_id);
  if (!workitem) {
    res.status(404).end();
    return;
  }
  if (workitem.transferred) { // Can't create for transferred WorkItem
    res.status(400).end();
    return;
  }
  var item = new MaterialsItem();
  item.description = req.body.description;
  item.quantity = req.body.quantity;
  item.price = req.body.price;
  item.vendor = req.body.vendor;
  item.cost = item.quantity * item.price;
  item.workItem = workitem.id;
  item.save();

  workitem.materialsItems.push(item.id);
  workitem.materials_cost += item.cost;
  await workitem.save();
  res.status(200).json(item);
}

async function delete_materialsitem(req, res) {
  var item = await MaterialsItem.findById(req.params.id);

  var workitem = await WorkItem.findById(item.workItem);
  if (item.transferred || workitem.transferred) {
    res.status(400).end();
    return;
  }
  workitem.materials_cost -= item.cost;
  workitem.materialsItems.pull({_id: item._id});
  await workitem.save();

  await MaterialsItem.deleteOne({_id:req.params.id});
  res.status(200).send();
}

// New cost is included into req.body.cost
async function edit_materialsitem(req, res) {
  var item = await MaterialsItem.findById(req.params.id);
  if (!item)
    res.status(404).end();
  if (item.transferred) {
    res.status(400).end();
    return;
  }
  var old_cost = item.cost;
  item = await MaterialsItem.findOneAndUpdate({_id: req.params.id}, req.body, {new: true,});

  var workitem = await WorkItem.findById(item.workItem);
  workitem.total -= old_cost;
  workitem.total += item.cost;
  await workitem.save();
  res.status(200).json(item);
}