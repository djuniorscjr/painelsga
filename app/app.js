angular.module('painel', [])
    .controller("painelCtrl", painelCtrl)
    .service("painelService", painelService)
    .constant("URL","##/api/##");

painelCtrl.$inject = ['painelService', '$scope'];
painelService.$inject = ['$interval', '$http', 'URL', '$rootScope'];

function painelCtrl(painelService, $scope) {
    var vm = this;
    vm.guiches = [];

    function construct(nameGuiche, senha, data){
        var guiche = {
            nameGuiche: nameGuiche,
            senha: senha,
            data: data
        };

        if(vm.guiches.length == 0){
            vm.guiches.push(guiche);
        }else{
            vm.guiches.splice(0,0, guiche);
        }
    };

    $scope.$on('call new service', function(event, args){
        if(args.data.length === 1){
            var res = args.data[0];
            construct(res.guiche, res.senha, res.data);
        }

    });
};

function painelService($interval, $http, URL, $rootScope) {

   function call(){
      var value = localStorage.getItem('data') === null ? "" : localStorage.getItem('data');
      return $http.get(URL + "1.0/call/"+ value)
            .then(getCallComplete)
            .catch(getCallFailed);

        function getCallComplete(response) {
            if(response.data.result.length !== 0){
                localStorage.setItem('data', response.data.result[0].data);
            }
            $rootScope.$broadcast('call new service', {data: response.data.result});
        };

        function getCallFailed(error) {
            console.log(error);
        };
   };

   $interval(call, 5000);
};
