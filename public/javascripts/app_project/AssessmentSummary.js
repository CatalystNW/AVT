class AssessmentSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <table className="table">
          <tbody>
            <tr>
              <th className="col-xs-3">Vetting Summary</th>
              <td className="col-xs-9"></td>
            </tr>
            <tr>
              <th className="col-xs-3">Assessment Summary</th>
              <td className="col-xs-9">
                <textarea className="form-control"></textarea>
              </td>
            </tr>
            <tr>
              <th className="col-xs-3"># Handle-It Work Items</th>
              <td className="col-xs-9"></td>
            </tr>
            <tr>
              <h2>Materials Lists</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Description</th>
                    <th scope="col">Price</th>
                    <th scope="col">Count</th>
                    <th scope="col">Vendor</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
              </table>
            </tr>
            <tr>
              <th className="col-xs-3"># Project Work Items Accepted</th>
              <td className="col-xs-9"></td>
            </tr>
            <tr>
              <h2>Materials Lists</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Description</th>
                    <th scope="col">Price</th>
                    <th scope="col">Count</th>
                    <th scope="col">Vendor</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
              </table>
            </tr>
            <tr>
              <th className="col-xs-3">Porta Potty Needed</th>
              <td className="col-xs-2"></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
