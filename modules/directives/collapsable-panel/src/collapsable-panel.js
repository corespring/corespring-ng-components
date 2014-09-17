angular.module('cs.directives')
  .directive('collapsablePanel', [
    function () {

      'use strict';

      return {
        transclude: true,
        restrict: 'E',
        template: '<div class="panel" ></div>',
        controller: function($scope, $element, $attrs) {

          this.toggle = function(){
            $scope[collapseVar] = !$scope[collapseVar];
          }

          var collapseVar;

          function isCollapsed(el){
            return !el.hasClass('in');
          }

          if ($attrs.collapsed){
            collapseVar = $attrs.collapsed;

            $scope.$watch(collapseVar,function(newVal){

              var content = $element.find('.collapse');
              if (isCollapsed(content) != newVal){
                content.collapse(newVal ? 'hide':'show');
              }
            })
          }
        },
        link:function(scope,$element,attrs,ctrl,$transclude){
          $transclude(scope, function(clone){
            $element.find('.panel').append(clone);
            //$element.append(clone);
          })
        }
      };
    }
  ])
  .directive('panelHeading',[function(){
    return {
      replace:true,
      require:"^collapsablePanel",
      transclude:true,
      restrict: 'E',
      scope: {},
      template: [
        ' <div class="panel-heading">',
        '    <a href ng-click="onClick()" >',
        '    </a>',
        '</div>'].join('\n'),
      link: function($scope, $element, $attrs, collapsiblePanel, $transclude){
        $scope.onClick = function(){
          collapsiblePanel.toggle();
        }

        $transclude($scope.$parent, function(clone){
          $element.find('a').append(clone);
        })
      }
    }
  }])
  .directive('panelContent',[function(){
    return {
      require:"^collapsablePanel",
      replace:true,
      transclude:true,
      restrict: 'E',
      scope: {},
      template: [
        '<div id="collapseOne" class="panel-collapse collapse in">',
        '  <div class="panel-body">',
        '  </div>',
        '</div>'].join('\n'),
      link:function(scope,$element,attrs,ctrl,$transclude){
        $transclude(scope.$parent, function(clone){
          $element.find('.panel-body').append(clone);
        })
      }
    }
  }]);
