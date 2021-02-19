var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { VettingWorkItemApp };

var VettingWorkItemApp = function (_React$Component) {
	_inherits(VettingWorkItemApp, _React$Component);

	function VettingWorkItemApp() {
		_classCallCheck(this, VettingWorkItemApp);

		return _possibleConstructorReturn(this, (VettingWorkItemApp.__proto__ || Object.getPrototypeOf(VettingWorkItemApp)).apply(this, arguments));
	}

	_createClass(VettingWorkItemApp, [{
		key: "render",
		value: function render() {
			var _React$createElement;

			return React.createElement(
				"div",
				null,
				React.createElement(
					"h3",
					null,
					"Add a Work Item"
				),
				React.createElement(
					"div",
					{ className: "panel panel-primary work-item", name: "new" },
					React.createElement(
						"div",
						{ className: "panel-body" },
						React.createElement(
							"h4",
							{ className: "card-title" },
							"New Work Item"
						),
						React.createElement(
							"div",
							{ className: "card-text" },
							React.createElement(
								"div",
								{ className: "form-group" },
								React.createElement(
									"label",
									{ className: "form-control-label" },
									"Name*"
								),
								React.createElement("input", { type: "text", className: "form-control", name: "name" })
							),
							React.createElement(
								"div",
								{ className: "form-group" },
								React.createElement(
									"label",
									{ className: "form-control-label" },
									"Description*"
								),
								React.createElement("textarea", { className: "form-control", name: "description", rows: "3" })
							),
							React.createElement(
								"div",
								{ className: "form-group" },
								React.createElement(
									"label",
									{ className: "form-control-label" },
									"Vetting Comments*"
								),
								React.createElement("textarea", { className: "form-control", name: "vettingComments", rows: "3" })
							),
							React.createElement(
								"div",
								{ className: "form-group" },
								React.createElement(
									"label",
									{ className: "form-control-label" },
									"Cost"
								),
								React.createElement("input", { type: "cost", className: "form-control", name: "cost" })
							),
							React.createElement(
								"div",
								{ className: "form-group" },
								React.createElement(
									"label",
									{ className: "form-control-label" },
									"Handle-it"
								),
								React.createElement("input", (_React$createElement = { type: "checkbox", name: "isHandle", id: "checkbox1", style: { "marginLeft": "10px; !important" }, value: "true" }, _defineProperty(_React$createElement, "name", "isHandle"), _defineProperty(_React$createElement, "checked", true), _React$createElement))
							)
						),
						React.createElement(
							"a",
							{ href: "#", className: "btn btn-primary card-link work-item-new" },
							"Save"
						),
						React.createElement(
							"a",
							{ href: "#", className: "btn btn-danger card-link work-item-clear" },
							"Clear"
						)
					)
				)
			);
		}
	}]);

	return VettingWorkItemApp;
}(React.Component);