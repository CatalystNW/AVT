export { PartnerMenu }

/**
 * Required Props: 
 *  type ("project" or "siteAssessment")
 *  assessment_id/project_id
 *  getModalMenu - function to get ModalMenu reference
 *  partners - list of partner data belong to project/assessment
 */
class PartnerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      partners: this.props.partners, // partners selected
      allPartners: [],
      checkedId_AllPartners: [],
      status: "show_current_partners"
    };
  }

  loadAllPartners = () => {
    $.ajax({
      url: "/app_project/partners",
      type: "GET",
      context: this,
      success: function(partnersData) {
        console.log(partnersData)
        
        // Set checkedId_AllPartners to true/false if selected
        let selectedPartners = this.state.partners;
        let partnerSet = new Set();
        for (let i=0; i<selectedPartners.length; i++) {
          partnerSet.add(selectedPartners[i]._id);
        }
        var checkedId_AllPartners = partnersData.map(
          (partner) => {
            return partnerSet.has(partner._id);
          });

        this.setState({
          allPartners: partnersData,
          checkedId_AllPartners: checkedId_AllPartners,
        });
      },
    });
  };

  // Changes status to showing current partners / selecting new partners
  change_status = () => {
    let new_status = (this.state.status == "show_current_partners") ?
              "show_all_partners" : "show_current_partners";
    if (new_status == "show_all_partners") {
      this.loadAllPartners();
    }
    this.setState({
      status: new_status,
    });
  }

  // Add selected partners to assessment/ project
  submitSelectedPartners = () => {
    let inputs = document.querySelectorAll("input[name=partnerId]:checked")
    const selectedPartners = [],
          selectedPartnerIds = [], 
          checkedId_AllPartners = this.state.allPartners.map(()=>{ return false;});
    let id, index;
    for (let i=0; i<inputs.length; i++) {
      id = inputs[i].value;
      index = inputs[i].getAttribute("index");
      selectedPartners.push(
        this.state.allPartners[index]
      );
      selectedPartnerIds.push(
        this.state.allPartners[index]._id
      );
      checkedId_AllPartners[index] = true;
    }

    let url;
    if (this.props.type == "project") {
      url =  "/app_project/projects/" + this.props.project_id + "/partners";
    } else {
      url = "/app_project/site_assessment/" + this.props.assessment_id + "/partners";
    }
    $.ajax({
      url: url,
      type: "PATCH",
      data: {
        selectedPartnerIds: selectedPartnerIds,
      },
      context: this,
      success: function(data) {
        this.setState({
          partners: selectedPartners,
          checkedId_AllPartners: checkedId_AllPartners,
        });
      }
    });

    this.change_status();
  };

  onClick_editPartner = (e) => {
    const partner_id = e.target.getAttribute("partner_id"),
          index = e.target.getAttribute("index"),
          location = e.target.getAttribute("location");
    var data = {...this.state[location][index]};
    data.type = "project";
    data.partner_id = data._id;
    this.props.getModalMenu().show_menu(
      "edit_partner",
      funkie.edit_partner,
      data,
      (editPartner) => {
        this.setState(state => {
          let new_allPartners = [...state.allPartners];
          let new_partners = [...state.partners];
          let i;
          for (i=0; i<new_allPartners.length; i++) {
            if (new_allPartners[i]._id == partner_id) {
              new_allPartners[i] = editPartner;
              break;
            }
          }
          for (i=0; i<new_partners.length; i++) {
            if (new_partners[i]._id == partner_id) {
              new_partners[i] = editPartner;
              break;
            }
          }
          return {
            allPartners: new_allPartners,
            partners: new_partners,
          };
        });
      }
    );
  };
  onClick_createPartner = () => {
    this.props.getModalMenu().show_menu(
      "create_partner",
      funkie.create_partner,
      {},
      (createdPartner) => {
        this.setState(state=> {
          let new_allPartners = [...state.allPartners, createdPartner];
          let new_checkedId = [...state.checkedId_AllPartners, true];
          return {
            allPartners: new_allPartners,
            checkedId_AllPartners: new_checkedId,
          };
        });
      }
    );
  }
  onClick_deletePartner = (e) => {
    const partner_id = e.target.getAttribute("partner_id"),
          index = e.target.getAttribute("index"),
          location = e.target.getAttribute("location");
    const confirm = window.confirm(`Are you sure you want to delete ${this.state[location][index].org_name}?`)
    if (confirm) {
      $.ajax({
        url: "/app_project/partners/" + partner_id,
        type: "DELETE",
        context: this,
        success: function() {
          // Deletes partners if selected & from all partners list
          this.setState(state => {
            let new_allPartners = [...state.allPartners];
            let new_checkedId = [...state.checkedId_AllPartners];
            let new_partners = [...state.partners];
            let i;
            for (i=0; i<new_allPartners.length; i++) {
              if (new_allPartners[i]._id == partner_id) {
                new_allPartners.splice(i, 1);
                new_checkedId.splice(i, 1);
                break;
              }
            }
            for (i=0; i<new_partners.length; i++) {
              if (new_partners[i]._id == partner_id) {
                new_partners.splice(i, 1);
                break;
              }
            }
            return {
              allPartners: new_allPartners,
              checkedId_AllPartners: new_checkedId,
              partners: new_partners,
            };
          });
        }
      });
    }
  };

  selectRow = (e) => {
    if (e.target.tagName == "BUTTON") {
      return; 
    }
    
    let element = e.target;
    for (let i=0; i<5; i++) { // Limit search to 5 elements
      if (element.tagName == "TR") {
        break;
      }
      element = element.parentNode;
    }
    const index = element.getAttribute("index");
    this.setState(state => {
      const new_checkedId_AllPartners =  [...state.checkedId_AllPartners];
      new_checkedId_AllPartners[index] = !state.checkedId_AllPartners[index];
      return { checkedId_AllPartners: new_checkedId_AllPartners }
    });
  };

  show_current_partners = () => {
    return (
      <div>
        <button type="button" className="btn btn-sm"
          onClick={this.change_status}>Modify Partners</button>
        <h3>Current Partners</h3>
        <table>
          <thead>
          <tr>
              <th scope="col">Name</th>
              <th scope="col">Address</th>
              <th scope="col">Contact</th>
              <th scope="col">Phone</th>
              <th scope="col">Email</th>
              <th scope="col">Options</th>
            </tr>
          </thead>
          <tbody>
            {this.state.partners.map((partner,index) => {
              return (<tr key={"current-" + partner._id}>
                <td>{partner.org_name}</td>
                <td>{partner.org_address}</td>
                <td>{partner.contact_name}</td>
                <td>{partner.contact_email}</td>
                <td>{partner.contact_phone}</td>
                <td>
                  <button type="button" className="btn btn-sm"
                    location={"partners"}
                    partner_id={partner._id} index={index}
                    onClick={this.onClick_editPartner}>Edit</button>
                </td>
              </tr>);
            })}
          </tbody>
        </table>
      </div>);
  };

  show_all_partners = () => {
    return (
    <div>
      <button type="button" className="btn btn-sm"
        onClick={this.submitSelectedPartners}>Submit</button>
      <button type="button" className="btn btn-sm"
        onClick={this.change_status}>Cancel</button>
      <button type="button" className="btn btn-sm"
        onClick={this.onClick_createPartner}>Create Partner</button>
      <h3>Available Partners</h3>
      <table>
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Name</th>
              <th scope="col">Address</th>
              <th scope="col">Contact</th>
              <th scope="col">Phone</th>
              <th scope="col">Email</th>
              <th scope="col">Options</th>
            </tr>
          </thead>
          <tbody>
            {this.state.allPartners.map((partner,index) => {
              return (
              <tr key={"all-" + partner._id} index={index} onClick={this.selectRow}>
                <td>
                  <input type="checkbox" index={index}
                    value={partner._id} name="partnerId"
                    readOnly
                    checked={this.state.checkedId_AllPartners[index]}
                  ></input>
                </td>
                <td>{partner.org_name}</td>
                <td>{partner.org_address}</td>
                <td>{partner.contact_name}</td>
                <td>{partner.contact_email}</td>
                <td>{partner.contact_phone}</td>
                <td>
                  <button type="button" className="btn btn-sm"
                    location={"allPartners"}
                    partner_id={partner._id} index={index}
                    onClick={this.onClick_editPartner}>Edit</button>
                  <button type="button" className="btn btn-sm"
                    location={"allPartners"}
                    partner_id={partner._id} index={index}
                    onClick={this.onClick_deletePartner}>Delete</button>
                </td>
              </tr>);
            })}
          </tbody>
        </table>
    </div>);
  };
  
  render() {
    if (this.state.status == "show_all_partners") {
      return (this.show_all_partners());
    } else {
      return (this.show_current_partners());
    }
  }
}