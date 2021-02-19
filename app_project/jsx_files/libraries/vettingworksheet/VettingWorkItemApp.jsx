export {VettingWorkItemApp}

class VettingWorkItemApp extends React.Component {
  render() {
    return (
    <div>
			<h3>Add a Work Item</h3>
			<div className="panel panel-primary work-item" name="new">
				<div className="panel-body">
					<h4 className="card-title">New Work Item</h4>
					<div className="card-text">
						<div className="form-group">
							<label className="form-control-label">Name*</label>
							<input type="text" className="form-control" name="name" />
						</div>
						<div className="form-group">
							<label className="form-control-label">Description*</label>
							<textarea className="form-control" name="description" rows="3"></textarea>
						</div>
						<div className="form-group">
							<label className="form-control-label">Vetting Comments*</label>
							<textarea className="form-control" name="vettingComments" rows="3"></textarea>
						</div>
						<div className="form-group">
							<label className="form-control-label">Cost</label>
							<input type="cost" className="form-control" name="cost" />
						</div>
						<div className="form-group">
							<label className="form-control-label">Handle-it</label>
							<input type="checkbox" name="isHandle" id="checkbox1" style={{"marginLeft": "10px; !important"}} value="true" name="isHandle" checked />
                 	 	</div>
					</div>
					<a href="#" className="btn btn-primary card-link work-item-new">Save</a>
					<a href="#" className="btn btn-danger card-link work-item-clear">Clear</a>
				</div>
			</div>
		</div>) ;   
  }
}