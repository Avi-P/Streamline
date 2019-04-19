let prodCheck = document.getElementById("productivityCheck");       // productivity check

/**
 * Displays the productivity so far
 */
prodCheck.onclick = function () {

    let list = [];
    let prod = [];

    let domain;

    storage.get({["productiveList"]: []}, function (result) {

        prod = result.productiveList;

        for (let i = 0; i < prod.length; i++) {

            domain = prod[i];

            storage.get(domain, function (r) {

                list.push([domain, r[domain.toString()]]);

                if (i === prod.length - 1) {

                    alert(displayArray(list));

                }

            });

        }

    });

};
