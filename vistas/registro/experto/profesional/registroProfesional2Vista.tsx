import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-elements';
import DocumentVista from "../../../../componentes/documentVista";
import DateTimePicker from '@react-native-community/datetimepicker';
import { buttons, textos, inputs } from "../../../../style/style";
export default class RegistroProfesional2Vista extends Component {
	constructor(props) {
		super(props)
		this.state = {
			date_arl: "", arl: {}, date_salud_pension: "", salud_pension: {}, show_arl: false, show_salud_pension: false
		}
	}
	continuar = () => {
		let informacion = this.props["navigation"].getParam("informacion");
		if (this.state["date_arl"] !== "")
			informacion["date_arl"] = this.convertDateTime(this.state["date_arl"]);
		if (Object.keys(this.state["arl"]).length) {
			informacion["arl"] = this.state["arl"];
		}
		if (this.state["date_salud_pension"] !== "")
			informacion["date_salud_pension"] = this.convertDateTime(this.state["date_salud_pension"]);
		if (Object.keys(this.state["salud_pension"]).length) {
			informacion["salud_pension"] = this.state["salud_pension"];
		}
		this.props["navigation"].navigate("RegistroCompletado", { informacion });
	}
	formatDate = date => {
		let today = new Date(date);
		let fecha = today.getDate() + "/" + parseInt(today.getMonth() + 1) + "/" + today.getFullYear();
		return fecha;
	}
	convertDateTime = date => {
		var fecha = new Date(date);
		return fecha.toISOString().split('T')[0] + ' ' + fecha.toTimeString().split(' ')[0];
	}
	render() {
		const { arl, date_arl, salud_pension, date_salud_pension, show_arl, show_salud_pension } = this.state;
		return (
			<View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
				<View style={{ backgroundColor: "silver" }}>
					<Text style={{ textAlign: "center", fontFamily: "Raleway-Bold", marginVertical: 10 }}>Paso 4 de 5</Text>
				</View>

				<Text style={{ fontSize: 20, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#273861", textAlign: "center", }}>Seguridad Social</Text>
				<ScrollView>
					<Text style={{ textAlign: "center", fontSize: 15 }}>Tu seguridad es importante mantén tu documentación al día</Text>

					<View style={{}}>
						<View style={{ marginHorizontal: 10, marginVertical: 10 }}>
							<Text style={{ marginHorizontal: 10, fontSize: 15, marginTop: 0, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Fecha de vencimiento ARL</Text>
							<View style={{ marginHorizontal: 10, borderWidth: 0.5, borderColor: "#A5A5A5", borderRadius: 7 }}>
								<TouchableOpacity onPress={() => this.setState({ show_arl: true })}
									style={{ flexDirection: "row", height: 45, padding: 10 }}>
									<Text style={{ marginLeft: 10, fontSize: 15, }}>{(date_arl !== "") ? this.formatDate(date_arl) : ""}</Text>
									<Ionicons name="ios-close-circle" color="#CE4343" size={25} style={{ marginHorizontal: 10, display: (date_arl !== "") ? "flex" : "none" }}
										onPress={() => { this.setState({ date_arl: "" }); }}
									/>
								</TouchableOpacity>
								{show_arl && <View>
									{Platform.OS === "ios" && <Button title="CONTINUAR"
										titleStyle={buttons.PrimaryText}
										onPress={() => { this.setState({ show_arl: false }); }}
									/>}
									<DateTimePicker
										testID="arlTimePicker"
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
						</View>

						<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
							<Text style={{ marginHorizontal: 0, fontSize: 15, marginTop: 0, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Adjuntar carnet o certificación de afiliación</Text>
							<View style={{ flexDirection: "row-reverse", borderWidth: 0.5, borderColor: "silver", borderRadius: 5, padding: 10 }}>
								<TouchableOpacity style={{ flex: 0.2, alignItems: "flex-end" }}>
									<DocumentVista doc={true} selectDocuments={(document) => {
										this.setState(prevState => ({ arl: document }));
									}} />
								</TouchableOpacity>
								<View style={{ flex: 1, alignContent: "flex-start", display: (Object.keys(arl).length) ? "flex" : "none", flexDirection: "row", alignItems: "center", borderWidth: 0.5, borderColor: "#FFFFFF", borderRadius: 10 }}>
									<Image source={(arl.format === "pdf") ? require("../../../../assets/iconos/pdf.png") : { uri: arl.uri }} style={{ width: 50, height: 50 }} />
									<Text style={{ marginLeft: 5, fontSize: 12, textDecorationLine: "underline", width: 160 }}>{arl["name"]}</Text>
									<Ionicons name="ios-close-circle" color="#CE4343" size={25} style={{ marginHorizontal: 10 }}
										onPress={() => { this.setState({ arl: {} }); }}
									/>
								</View>
							</View>
						</View>

						<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
							<Text style={{ marginHorizontal: 0, fontSize: 15, marginTop: 0, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Fecha de vencimiento Salud y Pensión</Text>
							<View style={{ marginHorizontal: 0, borderWidth: 0.5, borderColor: "#A5A5A5", borderRadius: 7 }}>
								<TouchableOpacity onPress={() => this.setState({ show_salud_pension: true })}
									style={{ flexDirection: "row", height: 45, padding: 10 }}>
									<Text style={{ marginLeft: 10, fontSize: 15, }}>{(date_salud_pension !== "") ? this.formatDate(date_salud_pension) : ""}</Text>
									<Ionicons name="ios-close-circle" color="#CE4343" size={25} style={{ marginHorizontal: 10, display: (date_salud_pension !== "") ? "flex" : "none" }}
										onPress={() => { this.setState({ date_salud_pension: "" }); }}
									/>
								</TouchableOpacity>
								{show_salud_pension && <View>
									{Platform.OS === "ios" && <Button title="CONTINUAR"
										titleStyle={buttons.PrimaryText}
										onPress={() => { this.setState({ show_salud_pension: false }); }}
									/>}
									<DateTimePicker
										testID="saludPensionTimePicker"
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
								</View>
								}
							</View>
						</View>

						<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
							<Text style={{ marginHorizontal: 0, fontSize: 15, marginTop: 0, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Adjuntar certificado último planilla</Text>
							<View style={{ flexDirection: "row-reverse", padding: 10, borderWidth: 0.5, borderColor: "#A5A5A5", borderRadius: 7 }}>
								<TouchableOpacity style={{ flex: 0.2, alignItems: "flex-end" }}>
									<DocumentVista doc={true} selectDocuments={(document) => {
										this.setState(prevState => ({ salud_pension: document }));
									}} />
								</TouchableOpacity>
								<View style={{ flex: 0.8, display: (Object.keys(salud_pension).length) ? "flex" : "none", flexDirection: "row", alignItems: "center", marginStart: 10, borderWidth: 0.5, borderColor: "#FFFFFF", borderRadius: 10 }}>
									<Image source={(salud_pension.format === "pdf") ? require("../../../../assets/iconos/pdf.png") : { uri: salud_pension.uri }} style={{ width: 50, height: 50 }} />
									<Text style={{ marginLeft: 5, fontSize: 12, textDecorationLine: "underline", width: 160 }}>{salud_pension["name"]}</Text>
									<Ionicons name="ios-close-circle" color="#CE4343" size={25} style={{ marginHorizontal: 10 }}
										onPress={() => { this.setState({ salud_pension: {} }); }}
									/>
								</View>
							</View>
						</View>
					</View>

					<View style={{ marginHorizontal: 30, marginVertical: 15 }}>
						<Text style={[{ fontFamily: "Raleway-Italic", fontSize: 13, color: "#8d8d8d" }]}>Nota:  * (campo obligatorio)</Text>
					</View>

				</ScrollView>
				<Button title="CONTINUAR" buttonStyle={buttons.primary}
					titleStyle={buttons.PrimaryText}
					onPress={() => this.continuar()}
				/>
				<Text style={{ textAlign: "center", marginBottom: 20, textDecorationLine: 'underline', color: "#3D99B9", fontFamily: "Raleway-Bold" }}
					onPress={() => this.props["navigation"].navigate("RegistroCompletado", { informacion: this.props["navigation"].getParam("informacion") })}>Saltar este paso</Text>
			</View>
		)
	}
}
