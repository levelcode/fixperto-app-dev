import React, { Component } from 'react';
import { ScrollView, Text, View, FlatList, Image } from 'react-native';
import Cargador from "../../../componentes/cargador";
import AlertModal from "../../../componentes/alertView";
import { Divider } from 'react-native-elements';
import { general, info, detalle } from "../../../style/request";
import { url } from "../../../componentes/config";
export default class SolicitudVista extends Component {
	constructor(props) {
		super(props);
		this.state = { textoAlert: "", showAlert: false, customer: "", id: "", registry_date: "", description: "", service: "", category: "", zone: "", emergency: "", address: "", photos: [], icon: "" }
	}
	componentDidMount() { this.getRequest(); }
	getRequest = () => {
		return fetch(url + 'seguridad/getRequest', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ id: this.props["navigation"].getParam("request") })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) { this.setState(responseJson.request); }
		}).catch((error) => {
			if (error.message === 'Timeout' || error.message === 'Network request failed') {
				this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
			}
		})
	}
	keyExtractor = (item, index) => index.toString();
	render() {
		let { id, registry_date, description, service, category, zone, emergency, address, photos, icon } = this.state;
		return (

			<ScrollView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />

				<View style={general.cont3}>

					<View style={[general.cont]}>
						<View style={{ flex: 0.3, alignItems: "center" }}>
							<View style={[info.cont_img, { marginTop: 20 }]}>
								{(icon) ?
									<Image source={{ uri: icon }} style={{ width: 50, height: 50 }} />
									: <Image source={require("../../../assets/icon.png")} style={{ width: 50, height: 50 }} />
								}
							</View>
						</View>

						<View style={{ flex: 0.9 }}>

							<View style={[info.cont_text, { padding: 20 }]}>

								{
									emergency === 1 &&
									<View style={{ flexDirection: "row", marginVertical: 5 }}>
										<Image source={require("../../../assets/iconos/emergencia.png")} style={{ width: 15, height: 15 }} />
										<Text style={{ marginRight: 5, fontFamily: "Raleway-Bold", fontSize: 16, marginStart: 5, color: "#293763" }}>Servicio de emergencia</Text>
									</View>
								}

								<Text style={[info.cont_text_title]}>{service}
									<Text style={[info.cont_text_title_cat]}>/{category}</Text>
								</Text>

								<Text style={[info.cont_text_title, general.cont4]}>Solicitud del servicio :
									<Text style={[info.cont_text_title_cat]}> {registry_date}</Text>
								</Text>

								<Text style={[info.cont_text_title, general.cont4]}>Descripción :
									<Text style={[info.cont_text_title_cat]}> {description}</Text>
								</Text>

								<Text style={[info.cont_text_title, general.cont4]}>Ubicación
									<Text style={[info.cont_text_title_cat]}> {zone}</Text>
								</Text>

								<Text style={[info.cont_text_title, general.cont4]}>Dirección :
									<Text style={[info.cont_text_title_cat]}> {(address) ? address : "Pendiente"}</Text>
								</Text>

								{(this.props["navigation"].getParam("phoneC")) && <Text
									style={[info.cont_text_title, general.cont4]}>Teléfono del cliente <Text style={[info.cont_text_title_cat]}> {this.props["navigation"].getParam("phoneC")}</Text>
								</Text>}

								{(this.props["navigation"].getParam("phoneE")) && <Text
									style={[info.cont_text_title, general.cont4]}>Teléfono del fixperto	<Text style={[info.cont_text_title_cat]}> {this.props["navigation"].getParam("phoneE")}</Text>
								</Text>}
							</View>
						</View>




					</View>

					<View style={[detalle.container_divider]}>
						<Divider style={[detalle.line_divider]} />
						<Text style={[detalle.text_divider]}>SERVICIOS</Text>
						<Divider style={[detalle.line_divider]} />
					</View>


					<View style={{ flexDirection: "row", marginBottom: 5, alignItems: "center", padding: 20 }}>
						<Image source={require("../../../assets/iconos/fotos.png")} style={{ width: 30, height: 30 }} />
						<Text style={[info.cont_text_title, { marginLeft: 10 }]}>Fotos</Text>
					</View>
					<View style={{ marginTop: 10, marginHorizontal: 10, display: (photos.length) ? "flex" : "none" }}>
						<FlatList horizontal data={photos}
							renderItem={({ item }) =>
								<Image source={{ uri: url + "uploads/requests/" + item["image"] }} style={{ marginStart: 5, width: 80, height: 80 }} />}
							keyExtractor={this.keyExtractor} />
					</View>
				</View>
				<Cargador show={(id === "")} />
			</ScrollView>
		)
	}
}