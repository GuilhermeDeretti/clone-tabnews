function status(request, response) {
  response.status(200).json({ menssage: "value" });
}

export default status;
