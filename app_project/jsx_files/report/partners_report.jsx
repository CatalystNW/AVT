export { PartnersReport }

import { functionHelper } from "../functionHelper.js"

class PartnersReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      partners: [],

    };
    this.getPartners();
  }

  getPartners = () => {
    $.ajax({
      url: "/app_project/report/partners",
      type: "GET",
      context: this,
      success: function(data) {
        const partnersDict = {};
        const partnersData = data.partners,
              projectsData = data.projects;
        let i;
        for (i=0; i<partnersData.length; i++) {
          partnersDict[partnersData[i]._id] = partnersData[i];
          partnersDict[partnersData[i]._id].projects = [];
        }

        for (i=0; i<projectsData.length; i++) {
          projectsData[i].partners.forEach(partner => {
            if (partner in partnersDict) {
              partnersDict[partner].push(projectsData[i]);
            }
          });
        }
        this.setState({
          partners: Object.entries(partnersDict),
        });
      }
    });
  };

  createPartnersTable = () => {
    return (<table>
      <thead>
        <tr>
          <th scope="col">Name</th>
        </tr>
      </thead>
      <tbody>
        
      </tbody>
    </table>);
  };

  render() {
    return (
    <div>
      {this.createPartnersTable()}
    </div>);
  }
}