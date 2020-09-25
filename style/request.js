import { StyleSheet } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';

const general = StyleSheet.create({
	container: {
		padding: 15,
	},

	cont: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},

	cont2: {
		flexDirection: "row",
		alignItems: "center"
	},

	cont3: {
		backgroundColor: "#FFFFFF",
		flex: 1,
	},

	cont4: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 6
	},

	cont5: {
		backgroundColor: "#FFFFFF",
		flex: 1,
		padding: 10
	},

	cont_img: {
		flex: 0.4,
		height: 80,

	},

	cont_parte2: {
		backgroundColor: "#FFFFFF",
		flex: 2,
		padding: 10,
	},

	cont_general: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "#FFFFFF"

	}


})

const info = StyleSheet.create({

	cont_img: {
		width: 50,
	},

	cont_img_image: {
		width: 50,
		height: 50,
	},

	cont_text: {
		width: 250,
	},

	cont_text_title: {
		fontFamily: "Raleway-Bold",
		color: "#273861",
		fontSize: 17,
		flexWrap: "wrap",
		flexShrink: 1
	},

	cont_text_title_cat: {
		fontWeight: "normal",
		fontSize: 15,
		flexWrap: "wrap",
		flexShrink: 1
	},

	cont_text_date: {
		fontSize: 14,
		marginTop: 5
	},

	cont_text_fixperto: {
		fontSize: 14,
		fontFamily: "Raleway-Bold",
	},

	img_esperando: {
		width: 18,
		height: 18,
	},

	text_esperando: {
		marginHorizontal: 5,
		fontFamily: "Raleway-Bold",
		marginTop: 5,
		fontSize: 15,
		color: "#293763"
	},

	img_ver_mas: {
		width: 15,
		height: 15,
	},

	ver_mas: {
		marginHorizontal: 5,
		color: "#42AECB",
		fontFamily: "Raleway-Bold",
		fontSize: 15
	}

})

const detalle = StyleSheet.create({
	img_detalle: {
		width: 15,
		height: 15,
	},

	text_detalle: {
		marginStart: 5,
		fontSize: 15,
		fontFamily: "Raleway-Regular",
	},

	cont_detalle: {
		backgroundColor: "#F8F8F8",
		paddingVertical: 20,
		paddingHorizontal: 10,
		marginLeft: 0,

	},

	container_divider: {
		flexDirection: "row",
		marginVertical: 10,
		alignItems: "center"
	},

	line_divider: {
		flex: 0.3,
		borderColor: "#63E2F7",
		borderWidth: 1
	},

	text_divider: {
		fontFamily: "Raleway-Bold",
		textAlign: "center",
		flex: 0.5,
		color: "#273861"
	},

	cont_contratado: {
		backgroundColor: "#F8F8F8",
		paddingVertical: 20,
		paddingHorizontal: 10
	},

	border_postulado: {
		borderBottomWidth: 2,
		borderBottomColor: "#36BF49",
	},

	button_chat: {
		backgroundColor: "#ECF7FA",
		marginTop: 10,
		height: 40,
		borderRadius: 0
	},

	button_servicio: {
		backgroundColor: "#49B0CD",
		marginTop: 10,
		height: 40,
		borderRadius: 0
	},

	button_cancelar: {
		backgroundColor: "#CE4343",
		marginTop: 10
	},

	button_chat_icon: {
		width: 25,
		height: 25
	},

	button_chat_text: {
		marginStart: 10,
		color: "#4DB2CE",
		fontFamily: "Raleway-Bold",
		fontSize: 14
	},

	button_servicio_text: {
		marginVertical: 10,
		color: "#FFFFFF",
		fontFamily: "Raleway-Bold",
		fontSize: 14,
	},

	servicio_text: {
		textAlign: "center",
		fontFamily: "Raleway-Bold",
		fontSize: 18,
		marginVertical: 10
	}
})

const statusVista = StyleSheet.create({

	cont_title: {
		flexDirection: "row",
		alignItems: "center",
		padding: 8,
		backgroundColor: "#F2F2F2"
	},

	cont_title_text: {
		fontFamily: "Raleway-Bold",
		marginHorizontal: 10,
		color: "#273961",
		fontSize: 17
	}
})

const fixperto = StyleSheet.create({
	img_background: {
		height: 150,
		justifyContent: "center",
		padding: 10
	},

	img_background_text1: {
		marginLeft: 150,
		color: "#FFFFFF",
		fontFamily: "Raleway-Bold",
		fontSize: 19,
		paddingRight: 55
	},

	img_background_text2: {
		marginLeft: 150,
		color: "#FFFFFF",
		fontWeight: "normal",
		fontSize: 16,
		paddingRight: 15
	},

	img_background_avatar: {
		width: 50,
		height: 50,
	},

	button_aceptar: {
		backgroundColor: "#F2FCFF",
		borderColor: "#43AECC",
		borderWidth: 1,
		paddingVertical: 2,
		paddingHorizontal: 10,
		marginTop: 10,
		width: 150
	},

	text_button: {
		marginHorizontal: 5,
		fontFamily: "Raleway-Bold",
		fontSize: 16,
		color: "#43AECC"
	},

	text_exp: {
		marginTop: 5,
	},

	text_location: {
		marginTop: -10,
		textAlign: "right"
	},

	cont_delete: {
		backgroundColor: "#FDF2EB",
		width: 40,
		borderRadius: 10,
		marginTop: 10,
		paddingVertical: 3
	},

	cont_delete_icon: {
		marginLeft: 0
	},

	text_valor: {
		color: "#43AECC",
		fontFamily: "Raleway-Bold",
		textAlign: "right"
	},

})

const modal = StyleSheet.create({

	cont_title: {
		flexDirection: "row",
		backgroundColor: "#e4e4e4",
		paddingTop: 5,
		paddingBottom: 5
	},

	cont_titles: {
		flex: 0.9,
		marginStart: 10,
		marginTop: 10
	},

	cont_title_text: {
		fontWeight: "bold",
		color: "#273861",
		fontSize: 18
	},

	cont_item: {
		flexDirection: "row",
		marginHorizontal: 10,
		marginBottom: 10,
		marginTop: 10
	},

	cont_item_text: {
		marginHorizontal: 8,
		fontSize: 15
	},

	text_checkbox: {
		color: "#48B0CB",
		fontSize: 13,
	}
})

const nueva = StyleSheet.create({

})

export { general, info, detalle, statusVista, fixperto, modal, nueva };

