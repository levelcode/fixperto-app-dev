import React, { Component } from 'react';
import { View, ScrollView, AsyncStorage, Image, Text } from 'react-native';
import { Button } from 'react-native-elements';
import Cargador from "../../../componentes/cargador";
import { buttons } from "../../../style/style";
import AlertModal from "../../../componentes/alertView";
import { url } from "../../../componentes/config";
export default class RegistroCompletadoVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, cargador: false, buttonDisabled: false } }
	ingresar = () => {
		this.setState({ cargador: true, buttonDisabled: true });
		AsyncStorage.getItem("@USER").then((user) => {
			var expert = JSON.parse(user)["typeId"];
			var us = JSON.parse(user)["id"];
			let method = (this.props["navigation"].getParam("type") === "emp") ? "fixpertoEmpresa/addEmpresaContinue" : "fixpertoProfesional/addProfesionalContinue";
			const createFormData = () => {
				var informacion = this.props["navigation"].getParam("informacion");
				const convertirImagen = (result, name) => {
					name = name + "_" + Date.now().toString();
					let localUri = result.uri;
					let filename = localUri.split('/').pop();
					let match = /\.(\w+)$/.exec(filename);
					let type = match ? `image/${match[1]}` : `image`;
					if (match[1] === "pdf") type = `application/pdf`;
					return { uri: localUri, name: name + match[0], type }
				}
				const data = new FormData();
				data.append("expert", expert);
				data.append("user", us);
				Object.keys(informacion).forEach(key => {
					switch (key) {
						case "arl":
							data.append("arl", convertirImagen(informacion[key], expert + "arl"));
							break;
						case "salud_pension":
							data.append("salud_pension", convertirImagen(informacion[key], expert + "salud_pension"));
							break;
						case "certifications":
							for (let index = 0; index < informacion[key].length; index++) {
								data.append("certifications", convertirImagen(informacion[key][index]["certification"], expert + "certifications_" + index));
								data.append("certification_type", informacion[key][index]["type"]);
							}
							break;
						case "jobs":
							for (let index = 0; index < informacion[key].length; index++) {
								data.append("jobs", convertirImagen(informacion[key][index]["photo"], expert + "jobs_" + index));
								data.append("jobs_description", informacion[key][index]["name"]);
							}
							break;
						case "regions":
							data.append("regions", JSON.stringify(informacion[key]));
							break;
						case "categoriesSelected":
							data.append("categoriesSelected", JSON.stringify(informacion[key]));
							break;
						case "collaborators":
							for (let index = 0; index < informacion[key].length; index++) {
								data.append("colaboradores", convertirImagen(informacion[key][index]["photo"], expert + informacion[key][index]["name"]));
								delete informacion[key][index]['photo'];
							}
							data.append("collaborators", JSON.stringify(informacion[key]));
							break;
						default: data.append(key, informacion[key]); break;
					}
				});
				return data;
			}; return fetch(url + method, {
				method: "POST", headers: { Accept: 'application/json', "Access-Token": globalThis.tokenAuth }, body: createFormData()
			}).then(response => response.json()).then(responseJson => {
				this.setState({ buttonDisabled: false, cargador: false });
				if (responseJson.success) { this.props["navigation"].navigate("BottomNavigatorFixperto"); }
				else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un error, por favor pruebe nuevamente" }); }
			})
				.catch((error) => {
					this.setState({ buttonDisabled: false, cargador: false });
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
		})
	}
	render() {
		return (
			<View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<Cargador show={this.state["cargador"]} texto="Enviando información..." modal={true} />
				<View style={{ backgroundColor: "silver" }}>
					<Text style={{ textAlign: "center", fontFamily: "Raleway-Bold", marginVertical: 10 }}>Paso 5 de 5</Text>
				</View>
				<ScrollView>

					<View style={{ marginVertical: 20, marginHorizontal: 25, borderRadius: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.58, shadowRadius: 16.00, elevation: 5, backgroundColor: "#ffffff", borderColor: "#63E2F7", borderWidth: 1.5, }}>

						<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", paddingHorizontal: 10 }}>
							<Image source={require("../../../assets/iconos/regalo.png")} style={{ height: 100, width: 119, marginVertical: 10 }} />
							<View style={{ marginLeft: 5 }}>
								<Text style={{ fontSize: 20 }}>Recibe tu</Text>
								<Text style={{ fontFamily: "Raleway-Bold", fontSize: 21, color: "#36425C", marginTop: 5, lineHeight: 22 }}>Plan Regalo</Text>
								<Text style={{ fontFamily: "Raleway-Bold", fontSize: 21, color: "#36425C", lineHeight: 22 }}>de Bienvenida</Text>
							</View>
						</View>

						<View style={{ flex: 1, alignItems: "center", backgroundColor: "#EEFCFF", borderRadius: 8 }}>
							<Text style={{ marginVertical: 10, fontSize: 16, color: "#283B64", fontWeight: "700" }}>Tu plan de bienvenida cuenta con:</Text>

							<View style={{ flex: 1, alignItems: "center", backgroundColor: "#EEFCFF" }}>
								<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", marginBottom: 5, alignSelf: "flex-start" }}>
									<Image source={require("../../../assets/iconos/fixcoin.png")} style={{ height: 25, width: 25, marginRight: 10 }} />
									<Text style={{ fontFamily: "Raleway-Bold", fontSize: 18, color: "#283B64" }}> 20 fixcoin</Text>
								</View>
								<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", marginBottom: 20, alignSelf: "flex-start" }}>
									<Image source={require("../../../assets/iconos/calendar.png")} style={{ height: 23, width: 23, marginRight: 10 }} />
									<Text style={{ fontFamily: "Raleway-Bold", marginTop: 5, fontSize: 18, color: "#283B64", lineHeight: 18 }}>60 días gratis</Text>
								</View>
							</View>

						</View>
					</View>

					<View style={{ backgroundColor: "#F8F8F8", marginVertical: 20, marginHorizontal: 25, borderRadius: 8, padding: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.58, shadowRadius: 16.00, elevation: 5, borderColor: "#FFFFFF", borderWidth: 1.3, }}>
						<Text style={{ fontFamily: "Raleway-Bold", fontSize: 22, color: "#36425C", lineHeight: 22, textAlign: "center", marginTop: 10, marginBottom: 10 }}>Beneficios</Text>
						<View style={{ flexDirection: "row", marginHorizontal: 30, marginBottom: 20, alignItems: "center" }}>
							<Image source={require("../../../assets/iconos/activo.png")} style={{ height: 25, width: 25 }} />
							<Text style={{ marginHorizontal: 15, fontSize: 16 }}>Activación en la plataforma (Se confirmará tu perfil en 24 horas aproximadamente)</Text>
						</View>
						<View style={{ flexDirection: "row", marginHorizontal: 30, marginBottom: 20, alignItems: "center" }}>
							<Image source={require("../../../assets/iconos/fixcoin.png")} style={{ height: 25, width: 25 }} />
							<Text style={{ marginHorizontal: 15, fontSize: 16 }}>Obsequio de 20 fixcoin (este debería tener vínculo a la explicación de funcionamiento del fixcoin), con ellos podrás aplicar a diferentes servicios.</Text>
						</View>
						<View style={{ flexDirection: "row", marginHorizontal: 30, marginBottom: 20, alignItems: "center" }}>
							<Image source={require("../../../assets/iconos/respaldo.png")} style={{ height: 25, width: 25 }} />
							<Text style={{ marginHorizontal: 15, fontSize: 16 }}>Postulación a capacitaciones que estén activas.</Text>
						</View>
						{/*<View style={{ flexDirection: "row", marginHorizontal: 30, marginBottom: 20, alignItems: "center" }}>
							<Image source={require("../../../assets/iconos/capacitaciones.png")} style={{ height: 25, width: 25 }} />
							<Text style={{ marginHorizontal: 15, fontSize: 16 }}>Capacitaciones.</Text>
						</View>*/}

					</View>
				</ScrollView>
				<Button title="INGRESAR" buttonStyle={buttons.primary}
					disabled={this.state["buttonDisabled"]}
					titleStyle={buttons.PrimaryText}
					onPress={() => this.ingresar()}
				/>
			</View>
		)
	}
}
