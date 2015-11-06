angular.module('app').controller('Stats',
    function ($scope, $http, $interval, toaster, $rootScope, $resource, $window) {

        $scope.validLocations = $rootScope.validLocations;
        $scope.searchValidLocations =[];
        $scope.loadingGuests = false;
        $scope.searchLocation = $window.localStorage.getItem('frontdesk_searchLocation1');
        if ($scope.searchLocation == "undefined" || $scope.searchLocation == "null") $scope.searchLocation = null;
        searchValidLocations.forEach(function(doc, i){
            if (doc.name === 'Spitalfields') {
                $scope.validLocations.forEach(function(doc2){
                    if(doc2.name === 'Spitalfields'){
                        doc.value = doc2.id;
                        $scope.searchValidLocations.push(doc);
                    }

                });
            }else if(doc.name === 'Notting Hill'){
                $scope.validLocations.forEach(function(doc2){
                    if(doc2.name === 'Notting Hill'){
                        doc.value = doc2.id;
                        $scope.searchValidLocations.push(doc);
                    }

                });

            }else if(doc.name === 'King\'s Cross' || doc.name === 'Kings Cross'  ){
                $scope.validLocations.forEach(function(doc2){
                    if(doc2.name === 'King\'s Cross' || doc2.name === 'Kings Cross'){
                        doc.value = doc2.id;
                        $scope.searchValidLocations.push(doc);
                    }

                });

            }else if(doc.name === 'All'){
                $scope.searchValidLocations.push(doc);
            }

        });
        $scope.data = [];
        $scope.grouped = false;
        $scope.date = {
            startDate: moment().subtract(1, 'week').startOf('week').toDate(),
            endDate: moment().subtract(1, 'week').endOf('week').toDate()
        };
        $scope.formattedData = [];

        formatData = function (d) {
            var date0 = d[0].date;
            var days = Math.floor((d[d.length - 1].date - d[0].date) / 86400000) + 1;
            var f = [];
            //f.push({name: 'optin', values: []});
            //f.push({name: 'optout', values: []});
            f.push([]);
            f.push([]);

            for (var i = 0; i < days; i++) {
                f[0].push({x: i + 1, y: 0});
                f[1].push({x: i + 1, y: 0});

            }

            f[0][0].name = "optin";
            f[1][0].name = "optout";

            d.forEach(function (d) {

                var curDay = Math.floor((d.date - date0) / 86400000);

                if (d._id.optin) {
                    f[0][curDay].y += d.count;
                } else {
                    f[1][curDay].y += d.count;
                }
                f[0][curDay].date = d.date;

            });

            return f;

        };

        loadData = function () {

            if ($scope.loading) return;
            $scope.loading = true;

            var url = '/data/promotions?start=' + moment($scope.date.startDate).format("YYYY-MM-DD") +
                '&end=' + moment($scope.date.endDate).format("YYYY-MM-DD");

            if ($scope.searchLocation)
                url += ('&locationId=' + $scope.searchLocation);

            $http.get(url)
                .success(function (data, headers) {
                    $scope.loading = false;
                    data.sort(function (a, b) {
                        a.date = new Date(a._id.year, a._id.month-1, a._id.day);
                        b.date = new Date(b._id.year, b._id.month-1, b._id.day);
                        if (b.date > a.date) {
                            return -1;
                        } else if ((a.date == b.date) && !a.optin) {
                            return -1;
                        } else {
                            return 1;
                        }
                    });
                    $scope.data = data;
                    $scope.formattedData = formatData(data);
                })
                .error(function (err) {
                    $scope.loading = false;
                    showError(err);
                });
        };

        $scope.$watch('date', function () {
            loadData();
        });

        $scope.$watch('searchLocation', function () {
            loadData();
        });

        loadData();

        showError = function (err) {
            if (!err)
                toaster.error(errors.UNKNOWN);
            else if (err.status == 403)
                toaster.error(errors.UNAUTHORIZED);
            else
                toaster.error(errors.UNKNOWN);
        };

    });


angular.module('app').directive('promoChart', function () {
    // constants
    var margin = 20,
        height = 500 - 0.5 - margin,
        color = d3.interpolateRgb("#f77", "#77f");

    return {
        restrict: 'E',
        scope: { // attributes bound to the scope of the directive
            val: '=',
            grouped: '='
        },
        link: function (scope, element, attrs) {

            scope.render = function (newVal) {
                // set up initial svg object
                var width = element[0].offsetWidth - 115;
                d3.select(element[0])
                    .selectAll('*').remove();
                var vis = d3.select(element[0])
                    .append("svg")
                    .attr("width", "100%")
                    .attr("height", height + margin + 100);

                vis.selectAll('*').remove();

                if (!newVal || newVal.length === 0) {
                    return;
                }

                var n = newVal.length, // number of layers
                    m = newVal[0].length, // number of samples per layer
                    data = d3.layout.stack()(newVal);

                var mx = m,
                    my = d3.max(data, function (d) {
                        return d3.max(d, function (d) {
                            return d.y0 + d.y;
                        });
                    }),
                    mz = d3.max(data, function (d) {
                        return d3.max(d, function (d) {
                            return d.y;
                        });
                    }),
                    x = function (d) {
                        return d.x * width / mx;
                    },
                    y0 = function (d) {
                        return height - d.y0 * height / my;
                    },
                    y1 = function (d) {
                        return height - (d.y + d.y0) * height / my;
                    },
                    y2 = function (d) {
                        return d.y * height / mz;
                    }; // or `my` not rescale

                // Layers for each color
                // =====================

                var layers = vis.selectAll("g.layer")
                    .data(data)
                    .enter().append("g")
                    .style("fill", function (d, i) {
                        return color(i / (n - 1));
                    })
                    .attr("class", "layer");

                // Bars
                // ====

                var bars = layers.selectAll("g.bar")
                    .data(function (d) {
                        return d;
                    })
                    .enter().append("g")
                    .attr("class", "bar")
                    .attr("transform", function (d) {
                        return "translate(" + x(d) + ",0)";
                    });
                bars.append("rect")
                    .attr("width", x({x: 0.9}))
                    .attr("x", 0)
                    .attr("y", height)
                    .attr("height", 0)
                    .transition()
                    .delay(function (d, i) {
                        return i * 10;
                    })
                    .attr("y", y1)
                    .attr("height", function (d) {
                        return y0(d) - y1(d);
                    });

                bars.select("rect")
                    .on("mouseover", function (d) {
                        var xPos = x(d) + d3.select(this).attr("width")/2;
                        var yPos = y1(d) + (y0(d) - y1(d))/2;
                        var height = parseFloat(d3.select(this).attr("height"));

                        d3.select(this).attr("stroke", "blue").attr("stroke-width", 0.8);

                        vis.append("text")
                            .attr("x", xPos)
                            .attr("y", (height/2)+yPos)
                            .attr("class", "charttip")
                            .text(Math.floor(d.y))
                            .transition()
                            .attr("x", xPos)
                            .attr("y", yPos);
                    })
                    .on("mouseout", function () {
                        vis.select(".charttip").remove();
                        d3.select(this).attr("stroke", "pink").attr("stroke-width", 0.2);

                    });

                // X-axis labels
                // =============

                var labels = vis.selectAll("text.label")
                    .data(data[0])
                    .enter().append("text")
                    .attr("class", "label")
                    .attr("x", x)
                    .attr("y", height + 6)
                    .attr("dx", x({x: 0.45}))
                    .attr("dy", ".71em")
                    .attr("text-anchor", "middle")
                    .text(function (d, i) {
                        if (d.date)
                            return moment(d.date).format("D/M");
                    });

                // Chart Key
                // =========

                var keyText = vis.selectAll("text.key")
                    .data(data)
                    .enter().append("text")
                    .attr("class", "key")
                    .attr("y", function (d, i) {
                        return height + 42 + 30 * (i % 3);
                    })
                    .attr("x", function (d, i) {
                        return 155 * Math.floor(i / 3) + 15;
                    })
                    .attr("dx", x({x: 0.45}))
                    .attr("dy", ".71em")
                    .attr("text-anchor", "left")
                    .text(function (d, i) {
                        return d[0].name;
                    });

                var keySwatches = vis.selectAll("rect.swatch")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "swatch")
                    .attr("width", 20)
                    .attr("height", 20)
                    .style("fill", function (d, i) {
                        return color(i / (n - 1));
                    })
                    .attr("y", function (d, i) {
                        return height + 36 + 30 * (i % 3);
                    })
                    .attr("x", function (d, i) {
                        return 155 * Math.floor(i / 3);
                    });
                // Animate between grouped and stacked
                // ===================================

                function transitionGroup() {
                    vis.selectAll("g.layer rect")
                        .transition()
                        .duration(500)
                        .delay(function (d, i) {
                            return (i % m) * 10;
                        })
                        .attr("x", function (d, i) {
                            return x({x: 0.9 * ~~(i / m) / n});
                        })
                        .attr("width", x({x: 0.9 / n}))
                        .each("end", transitionEnd);

                    function transitionEnd() {
                        d3.select(this)
                            .transition()
                            .duration(500)
                            .attr("y", function (d) {
                                return height - y2(d);
                            })
                            .attr("height", y2);
                    }
                }

                function transitionStack() {
                    vis.selectAll("g.layer rect")
                        .transition()
                        .duration(500)
                        .delay(function (d, i) {
                            return (i % m) * 10;
                        })
                        .attr("y", y1)
                        .attr("height", function (d) {
                            return y0(d) - y1(d);
                        })
                        .each("end", transitionEnd);

                    function transitionEnd() {
                        d3.select(this)
                            .transition()
                            .duration(500)
                            .attr("x", 0)
                            .attr("width", x({x: 0.9}));
                    }
                }

                // reset grouped state to false
                scope.grouped = false;

                // setup a watch on 'grouped' to switch between views
                scope.$watch('grouped', function (newVal, oldVal) {
                    // ignore first call which happens before we even have data from the Github API
                    if (newVal === oldVal) {
                        return;
                    }
                    if (newVal) {
                        transitionGroup();
                    } else {
                        transitionStack();
                    }
                });
            };


            window.onresize = function () {
                return scope.$apply();
            };

            scope.$watch(function () {
                    return angular.element(window)[0].innerWidth;
                }, function () {
                    return scope.render(scope.val);
                }
            );

            // whenever the bound 'exp' expression changes, execute this
            scope.$watch('val', function (newVal, oldVal) {
                // clear the elements inside of the directive
                scope.render(newVal);

            });
        }
    };
});