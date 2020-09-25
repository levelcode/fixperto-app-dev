import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Notifications } from 'expo';
import { Badge, ListItem } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
export default class NotificacionesVista extends Component {
	constructor(props) { super(props); this.state = { visible: false, notifications: [] }; }
	componentDidMount() { Notifications.addListener(this._handleNotification); }
	_handleNotification = notification => {
		if (notification["data"]["tipo"] && notification["data"]["tipo"] !== "chat")
			this.setState(prevState => ({ notifications: prevState["notifications"].concat(notification["data"]) }));
	};
	onPressNotification = () => { this.setState(prevState => ({ visible: !prevState["visible"] })); }
	selectedNotification = (notification, i) => {
		this.setState({ visible: false });
		if (notification["vista_data"]) {
			this.props["navigation"].navigate(notification["vista"], notification["vista_data"]);
		}
		else { this.props["navigation"].navigate(notification["vista"]); }
	}
	clearAll = () => { this.setState({ visible: false, notifications: [] }) }
	delNotification = i => {
		let notifications = this.state["notifications"];
		if (i !== -1) { notifications.splice(i, 1); }
		if (notifications.length > 0) {
			this.setState({ notifications: notifications });
		} else { this.setState({ notifications: [], visible: false }); }
	}
	render() {
		const { notifications, visible } = this.state;
		return (
			<View style={(Platform.OS === 'ios') ? { marginVertical: 5 } : { marginVertical: 15 }}>
				<TouchableOpacity onPress={() => { if (notifications.length) this.onPressNotification() }}>
					<Ionicons name="ios-notifications-outline" size={30} style={{ marginHorizontal: 10 }} color="#43AECC" />
					<Badge value={notifications.length} status="error" containerStyle={{ position: 'absolute', top: -4, right: -4 }} />
				</TouchableOpacity >
				<Modal isVisible={visible} style={{ marginTop: 55, padding: 10 }} >
					<View style={{ flexDirection: "row", alignItems: "flex-end", }}>
						<Text style={{ textAlign: "left", color: "white", fontSize: 14, marginBottom: 5, fontFamily: "Raleway-Bold", flex: 0.65 }}>NOTIFICACIONES</Text>
						<Text onPress={() => { this.clearAll() }} style={{ marginBottom: 5, marginRight: 10, textDecorationLine: 'underline', color: "#42AECB", fontSize: 14, fontFamily: "Raleway-Bold", textAlign: "left", flex: 0.25 }} >LIMPIAR</Text>
						<View style={{ alignItems: "flex-end", flex: 0.10 }}>
							<Ionicons name="ios-close-circle" size={30} color="#42AECB" onPress={() => { this.onPressNotification() }} />
						</View>
					</View>
					<ScrollView style={{ flex: 1 }}>
						{notifications.map((notification, i) => (
							<ListItem
								key={i} bottomDivider
								containerStyle={{ borderRadius: 7, marginTop: 5, backgroundColor: "#ECF7F9", borderColor: "#42AECB", borderWidth: 2, }}
								title={<View style={[{ flexDirection: "row" }]}>
									<View style={[{ flex: 0.9 }]}>
										<Text style={{ fontFamily: "Raleway-Bold", fontSize: 16, color: "#27375A", marginBottom: 5 }}>{notification["title"]}</Text>
										<Text style={{ fontSize: 15, color: "#27375A" }}>{notification["texto"]}</Text>
									</View>
									<TouchableOpacity style={[{ flex: 0.1, borderColor: "#CE4343", borderWidth: 1, paddingHorizontal: 5, height: 33, alignItems: "center", borderRadius: 7, backgroundColor: "white", top: 15 }]} onPress={() => this.delNotification(i)} >
										<Ionicons name="ios-trash" size={30} color="#CE4343" style={[]} />
									</TouchableOpacity>
								</View>
								}
								onPress={() => { this.selectedNotification(notification, i) }}
							/>
						))}
					</ScrollView>
				</Modal>
			</View>
		)
	}
}