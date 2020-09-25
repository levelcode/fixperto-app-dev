import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, AsyncStorage, Image, Text, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Button } from 'react-native-elements';
import DocumentVista from "../../../componentes/documentVista";
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationEvents } from 'react-navigation';
import { buttons, textos, inputs } from "../../../style/style";
import AlertModal from "../../../componentes/alertView";
import { url } from "../../../componentes/config";
import * as Linking from 'expo-linking';
export default class SeguridadSocialIndependienteVista extends Component {
	constructor(props) {
		super(props)
		this.state = {
			textoAlert: "", showAlert: false,
			date_arl: "", arl: {}, date_salud_pension: "", salud_pension: {}, show_arl: false, show_salud_pension: false,
			buttonDisabled: false, arl_mod: false, salud_pension_mod: false
		}
	}
	getSeguridadSocial = () => {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			return fetch(url + 'fixpertoProfesional/getSeguridadSocial', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ id: user["typeId"] })
			}).then(response => response.json()).then(responseJson => {
				if (responseJson.success) {
					var result = responseJson.result;
					this.setState({
						date_arl: (result["date_arl"] !== null) ? this.convertDateTimeUpdate(result["date_arl"]) : "",
						arl: (result["arl"]) ? {
							format: result["arl"].split(".")[1],
							name: result["arl"],
							uri: url + "uploads/registros/profesional/arl/" + result["arl"]
						} : {},
						date_salud_pension: (result["date_salud_pension"] !== null) ? this.convertDateTimeUpdate(result["date_salud_pension"]) : "",
						salud_pension: (result["salud_pension"]) ? {
							format: result["salud_pension"].split(".")[1],
							name: result["salud_pension"],
							uri: url + "uploads/registros/profesional/salud_pension/" + result["salud_pension"]
						} : {}
					});
				}
			}).catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
		})
	}
	guardar = () => {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			this.setState({ buttonDisabled: true });
			const createFormData = () => {
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
				data.append("id", user["typeId"]);
				Object.keys(this.state).forEach(key => {
					switch (key) {
						case "arl_mod":
							if (this.state["arl_mod"])
								data.append("arl", convertirImagen(this.state["arl"], user["typeId"] + "arl"));
							break;
						case "salud_pension_mod":
							if (this.state["salud_pension_mod"])
								data.append("salud_pension", convertirImagen(this.state["salud_pension"], user["typeId"] + "salud_pension"));
							break;
						case "date_arl":
							if (this.state["date_arl"] !== "")
								data.append("date_arl", this.convertDateTime(this.state["date_arl"]));
							break;
						case "date_salud_pension":
							if (this.state["date_salud_pension"] !== "")
								data.append("date_salud_pension", this.convertDateTime(this.state["date_salud_pension"]));
							break;
					}
				});
				return data;
			};
			createFormData();
			return fetch(url + 'fixpertoProfesional/modSeguridadSocial', {
				method: "POST",
				headers: { Accept: 'application/json', "Access-Token": globalThis.tokenAuth },
				body: createFormData()
			}).then(response => response.json()).then(responseJson => {
				this.setState({ buttonDisabled: false });
				if (responseJson.success) { this.props["navigation"].goBack(); }
				else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
			}).catch((error) => {
				this.setState({ buttonDisabled: false });
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
		})
	}
	formatDate = date => {
		let today = new Date(date); return today.getDate() + "/" + parseInt(today.getMonth() + 1) + "/" + today.getFullYear();
	}
	convertDateTimeUpdate(date) { var from = date.split("/"); return new Date(from[2], from[1] - 1, from[0]); }
	convertDateTime = (date) => {
		var fecha = new Date(date); return fecha.toISOString().split('T')[0] + ' ' + fecha.toTimeString().split(' ')[0];
	}
	shoDoc = uri => { Linking.openURL(uri); }
	render() {
		const { arl, date_arl, salud_pension, date_salud_pension, show_arl, show_salud_pension } = this.state;
		return (
			<View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<NavigationEvents onDidFocus={payload => { this.getSeguridadSocial() }} />
				<ScrollView>
					<Text style={{ fontSize: 20, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#273861", textAlign: "center", }}>Seguridad Social</Text>
					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ marginHorizontal: 0, fontSize: 15, marginTop: 0, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Fecha de vencimiento ARL</Text>
						<TouchableOpacity
							onPress={() => this.setState({ show_arl: true })}
							style={{ flexDirection: "row", alignItems: "center", height: 45, borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7 }}>
							<Text style={{ marginLeft: 10, fontSize: 15, }}>{(date_arl) ? this.formatDate(date_arl) : ""}</Text>
						</TouchableOpacity>
						{show_arl && <View>
							{Platform.OS === "ios" && <Button title="CONTINUAR"
								buttonStyle={{ backgroundColor: "#49B0CD" }}
								titleStyle={{ color: "#FFFFFF", fontSize: 14 }}
								onPress={() => { this.setState({ show_arl: false }); }}
							/>}
							<DateTimePicker
								testID="dateInicioTimePicker"
								value={date_arl || new Date()}
								minimumDate={new Date()}
								onChange={(event, date_arl) => {
									if (Platform.OS === "android" && event["type"] === "set") {
										this.setState({ date_arl, show_arl: false });
									}
									else if (Platform.OS === "ios") {
										this.setState({ date_arl });
									}
								}}
							/>
						</View>
						}
					</View>

					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ marginHorizontal: 0, fontSize: 15, marginTop: 0, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Arl</Text>
						<View style={{ flexDirection: "row-reverse", borderWidth: 0.5, borderColor: "silver", borderRadius: 5, padding: 10 }}>
							<TouchableOpacity style={{ flex: 0.2, alignItems: "flex-end" }}>
								<DocumentVista doc={true} selectDocuments={(document) => {
									this.setState({ arl: document, arl_mod: true });
								}} />
							</TouchableOpacity>
							<View style={{ flex: 1, alignContent: "flex-start", display: (Object.keys(arl).length) ? "flex" : "none", flexDirection: "row", alignItems: "flex-start", borderWidth: 0.5, borderColor: "#FFFFFF", borderRadius: 10 }}>
								<Image source={(arl.format === "pdf") ? require("../../../assets/iconos/pdf.png") : { uri: arl.uri }} style={{ width: 50, height: 50 }} />
								<Text onPress={() => { this.shoDoc(arl.uri); }} style={{ marginLeft: 5, fontSize: 12, textDecorationLine: "underline", width: 160 }}>{this.state["arl"].name}</Text>
							</View>
						</View>
					</View>

					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ marginHorizontal: 0, fontSize: 15, marginTop: 0, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Fecha de vencimiento Salud y Pensión</Text>
						<TouchableOpacity
							onPress={() => this.setState({ show_salud_pension: true })}
							style={{ flexDirection: "row", height: 45, padding: 10, borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7 }}>
							<Text style={{ marginLeft: 10, fontSize: 15, }}>{(date_salud_pension) ? this.formatDate(date_salud_pension) : ""}</Text>
						</TouchableOpacity>
						{show_salud_pension && <View>
							{Platform.OS === "ios" && <Button title="CONTINUAR"
								buttonStyle={{ backgroundColor: "#49B0CD" }}
								titleStyle={{ color: "#FFFFFF", fontSize: 14 }}
								onPress={() => { this.setState({ show_salud_pension: false }); }}
							/>}
							<DateTimePicker
								testID="dateInicioTimePicker"
								value={date_salud_pension || new Date()}
								minimumDate={new Date()}
								onChange={(event, date_salud_pension) => {
									if (Platform.OS === "android" && event["type"] === "set") {
										this.setState({ date_salud_pension, show_salud_pension: false });
									}
									else if (Platform.OS === "ios") {
										this.setState({ date_salud_pension });
									}
								}}
							/>
						</View>}
					</View>

					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ fontSize: 15, marginTop: 0, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Adjuntar certificado último planilla</Text>
						<View style={{ flexDirection: "row-reverse", borderWidth: 0.5, borderColor: "silver", borderRadius: 5, padding: 10 }}>
							<TouchableOpacity style={{ flex: 0.2, alignItems: "flex-end" }}>
								<DocumentVista doc={true} selectDocuments={(document) => {
									this.setState({ salud_pension: document, salud_pension_mod: true });
								}} />
							</TouchableOpacity>
							<View style={{ flex: 0.8, display: (Object.keys(salud_pension).length) ? "flex" : "none", flexDirection: "row", alignItems: "center", borderWidth: 0.5, borderColor: "#FFFFFF", borderRadius: 10 }}>
								<Image source={(salud_pension.format === "pdf") ? require("../../../assets/iconos/pdf.png") : { uri: salud_pension.uri }} style={{ width: 50, height: 50 }} />
								<Text onPress={() => { this.shoDoc(salud_pension.uri); }} style={{ marginLeft: 5, fontSize: 12, textDecorationLine: "underline", width: 160 }}>{salud_pension.name}</Text>
							</View>
						</View>
					</View>

					<View style={{ marginHorizontal: 30, marginVertical: 15 }}>
						<Text style={[{ fontFamily: "Raleway-Italic", fontSize: 13, color: "#8d8d8d" }]}>Nota:  * (campo obligatorio)</Text>
					</View>

				</ScrollView>
				<Button title="GUARDAR" buttonStyle={buttons.primary}
					disabled={this.state["buttonDisabled"]}
					titleStyle={buttons.PrimaryText}
					onPress={() => this.guardar()} />
			</View>
		)
	}
}