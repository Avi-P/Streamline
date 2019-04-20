let prodCheck = document.getElementById("productivityCheck");       // productivity check

/**
 * Displays the productivity so far
 */
prodCheck.onclick = function () {

    let prodList = [];                      // productive list that will be stored
    let prod = [];                          // the stored productive list

    let unprodList = [];                    // unproductive list that will be stored
    let unprod = [];                        // the stored unproductive list

    storage.get({["productiveList"]: []}, function (result) {   // gets the productive list

        prod = result.productiveList;               // the resulting productive list

        for (let i = 0; i < prod.length; i++) {

            storage.get(prod[i], function (r) {         // gets the time spent in each domain

                prodList.push([prod[i], r[prod[i].toString()]]);    // adds the domain and its time spent

            });

        }

        if (prod.length === 0) {                            // if no websites have been saved

            prodList = ["No productive websites entered!"]; // set a message

        }

        storage.get({["unproductiveList"]: []}, function (result) { // gets the unproductive list

            unprod = result.unproductiveList;           // the resulting unproductive list

            if (unprod.length === 0) {                  // if no websites have been saved

                unprodList = ["No unproductive websites entered!"]; // set a message
                alert("Productivity:\n" + displayArray(prodList) + "\n" + "Unproductivity:\n" + displayArray(unprodList));      // display the report

            } else {

                for (let i = 0; i < unprod.length; i++) {

                    storage.get(unprod[i], function (r) {           // gets the time spent

                        unprodList.push([unprod[i], r[unprod[i].toString()]]);  // adds the domain and time spent

                        if (i === unprod.length - 1) {              // goes to the last value

                            //alert("Prouctivity:\n" + displayArray(prodList));

                            alert("Productivity:\n" + displayArray(prodList) + "\n" + "Unproductivity:\n" + displayArray(unprodList));  // display the report

                        }

                    });

                }

            }

        });

    });

};
