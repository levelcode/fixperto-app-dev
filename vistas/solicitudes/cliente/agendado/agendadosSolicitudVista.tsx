import React, { Component } from 'react';
import { ScrollView, Text, View, TouchableOpacity, AsyncStorage, Image, } from 'react-native';
import { ListItem } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import Cargador from "../../../../componentes/cargador";
import AlertModal from "../../../../componentes/alertView";
import { general, info } from "../../../../style/request.js";
import Actualizar from "../../../../componentes/actualizarVista";
import { url } from "../../../../componentes/config";
export default class AgendadosSolicitudVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, cargador: false, requests: [] } }
	getRequests = () => {
		this.setState({ cargador: true });
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			return fetch(url + 'cliente/getRequestsScheduled', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ id: user["typeId"] })
			}).then(response => response.json()).then(responseJson => {
				this.setState({ cargador: false });
				if (responseJson.success) { this.setState({ requests: responseJson.requests }); }
				else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un error, por favor pruebe nuevamente" }); }
			})
				.catch((error) => {
					this.setState({ cargador: false });
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
		})
	}
	render() {
		return (
			<View style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<ScrollView>
					<NavigationEvents onDidFocus={payload => { this.getRequests() }} />
					{this.state["requests"].length > 0 && this.state["requests"].map((item, i) => (
						<ListItem
							containerStyle={[general.contaner, { display: (this.state["cargador"]) ? "none" : "flex" }]}
							key={i} bottomDivider topDivider
							title={
								<View style={[general.cont]}>
									<View style={{ flex: 0.3, alignItems: "center" }}>
										<View style={[info.cont_img]}>
											{(item.icon) ?
												<Image source={{ uri: item.icon }} style={[info.cont_img_image]} />
												: <Image source={require("../../../../assets/icon.png")} style={[info.cont_img_image]} />
											}
										</View>
									</View>
									<View style={{ flex: 0.9, }}>
										<View style={[info.cont_text]}>
											{item.emergency === 1 && <View style={[general.cont2, { marginBottom: 5 }]}>
												<Image source={require("../../../../assets/iconos/emergencia.png")} style={{ width: 18, height: 18 }} />
												<Text style={[info.text_esperando, { color: "#293763" }]}>Solicitud de emergencia</Text>
											</View>}
											<Text style={[info.cont_text_title]}>{item.service}
												<Text style={[info.cont_text_title_cat]}>/{item.category}</Text>
											</Text>
											<Text style={[info.cont_text_fixperto]}>{item.fixperto}</Text>
											<Text style={[info.cont_text_date, { marginBottom: 5 }]}>Fecha del servicio: {(item.scheduled_date) ? item.scheduled_date : "Pendiente"}</Text>
											{item.emergency === 1 && <View style={[{ flexDirection: "row" }]}>
												<Text style={{ fontFamily: "Raleway-Bold", marginTop: 2, marginBottom: 2, color: "#273861", fontSize: 15 }}>Tiempo de respuesta: </Text>
												<Text style={{ fontFamily: "Raleway-Bold", marginTop: 2, marginBottom: 2, color: "#273861", fontSize: 15 }}>{item.response_time}</Text>
											</View>}
											<TouchableOpacity style={[general.cont2, general.cont4]}
												onPress={() => this.props["navigation"].navigate("AgendadaDetalle", { id: item.id, item })}>
												<Image source={require("../../../../assets/iconos/mas.png")} style={[info.img_ver_mas]} />
												<Text style={info.ver_mas}>Ver más</Text>
											</TouchableOpacity>
										</View>
									</View>
								</View>
							}
							onPress={() => this.props["navigation"].navigate("AgendadaDetalle", { id: item.id, item })}
						/>
					))
					}
					<Cargador show={this.state["cargador"]} texto="Actualizando solicitudes agendadas..." />
				</ScrollView>
				<Actualizar reload={this.getRequests} />
			</View >
		);
	}
}

