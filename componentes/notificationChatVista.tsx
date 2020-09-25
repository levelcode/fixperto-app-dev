import React, { Component } from 'react';
import { Badge } from 'react-native-elements';
import { Notifications } from 'expo';
import * as FileSystem from 'expo-file-system';
export default class NotificacionesVista extends Component {
	constructor(props) { super(props); this.state = { cant: 0, id_mensage: "" }; }
	componentDidMount() {
		FileSystem.readAsStringAsync(FileSystem.documentDirectory + '/config.json')
			.then((contenido) => {
				contenido = JSON.parse(contenido);
				this.setState({ cant: (contenido["notifications"]) ? contenido["notifications"].length : 0 });
			})
		Notifications.addListener(this._handleNotification);
		this.props["_emitter"].addListener('ressetBadgeChat', () => { this.setState({ cant: 0, id_mensage: "" }); });
	}
	_handleNotification = notification => {
		if (notification["data"]["tipo"] === "chat") {
			if (notification["data"]["message"] && (notification["data"]["message"]["_id"] !== this.state["id_mensage"])) {
				FileSystem.readAsStringAsync(FileSystem.documentDirectory + '/config.json').then((contenido) => {
					contenido = JSON.parse(contenido);
					contenido["notifications"].push({ de: notification["data"]["vista_data"]["chat"]["to"]["id"], para: notification["data"]["vista_data"]["chat"]["user"]["id"], request: notification["data"]["vista_data"]["chat"]["request"] });
					FileSystem.writeAsStringAsync(FileSystem.documentDirectory + '/config.json', JSON.stringify(contenido));
				})
				this.setState(prevState => ({ id_mensage: notification["data"]["message"]["_id"], cant: prevState["cant"] + 1 }));
			}
		}
	};
	render() {
		const { cant } = this.state;
		return (<Badge value={cant} status="error" containerStyle={{ display: (cant > 0) ? "flex" : "none" }} />)
	}
}