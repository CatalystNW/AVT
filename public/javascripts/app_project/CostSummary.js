class CostSummary extends React.Component {
  constructor(props) {
    super(props);
  }

  load_data = () => {
    console.log("load");
  }

  render() {
    return(
      <table className="table">
        <tbody>
          <tr>
            <th className="col-xs-8"># Handle-It Work items</th>
            <td className="col-xs-4"></td>
          </tr>
          <tr>
            <td>
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
            </td>
          </tr>
          <tr>
            <th className="col-xs-8">Volunteers Req.</th>
            <td className="col-xs-4"></td>
          </tr>
          <tr>
            <th className="col-xs-8"># Project Work Items Accepted</th>
            <td className="col-xs-4"></td>
          </tr>
          <tr>
            <td>
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
            </td>
          </tr>
          <tr>
            <th className="col-xs-8">Volunteers Req.</th>
            <td className="col-xs-4"></td>
          </tr>
        </tbody>
      </table>
    );
  }
}