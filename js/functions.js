function sendStartMsg() {
	$.ajax({
		url: deviceIP + "+hi+",
		type: 'GET',
		//async: false,
		cache: false,
		timeout: 2500,
		error: function () {
			$.mobile.loading('hide');
			$.hyc.ui.alert({
				content: 'ارتباط با دستگاه برقرار نیست لطفا مطمئن شوید به شبکه وایفای مربوط به دستگاه متصل شده اید.',
				buttons: [{
					name: 'قبول',
					id: 'confirmBtn',
					color: '#fff',
					bgColor: '#080',
					callback: function () {
						this.close();
					},
					closable: true
				}, ],
				color: "#aaa",
				closable: true
			});
		},
		success: function (data) {
			$.mobile.loading('hide');

		}
	});
}