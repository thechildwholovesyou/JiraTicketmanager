let modalExists = false;
let modal;
let transModal;
let selectedPriority;
let allFilters = $(".filter");

//.....loadTicket for the first time...............
function loadTickets(color) {
    let allTask = localStorage.getItem("allTask");
    if (allTask != null) {
        allTask = JSON.parse(allTask);
        if (color) {
            allTask = allTask.filter(function (data) {
                return data.priority == color;
            });
        }
        for (let i = 0; i < allTask.length; i++) {
            let ticket = $(`<div class="ticket">
                            <div class="priority-color priority-color-${allTask[i].priority}"></div>
                            <div class="ticket-id">#${allTask[i].ticketId}</div>
                            <div class="task-container">${allTask[i].task}</div>
                            </div>`);
            $(".ticket-container").append(ticket);

            ticket.click(function (e) {
                if ($(e.currentTarget).hasClass("active")) {
                    $(e.currentTarget).removeClass("active");
                } else {
                    $(e.currentTarget).addClass("active");
                }
            });
        }
    }
}

loadTickets();

$(".add").click(showModal);

function showModal(e) {
    if (!modalExists) {
        modal = $(`<div class="modal-parent">
            <div class="add-task">ADD TICKET</div>
            <div class="input-modal" >
                <textarea class="textarea" datatyped="false" contenteditable="true" placeholder="Enter your task here"></textarea>
            </div>
            <div class="modal-confirmation">
                <div class="save-btn btn">Save</div>
                <div class="cancel-btn btn">Cancel</div>
            </div>
            <div class="priority-list">
                <div class="modal-pink-filter modal-filter active"></div>
                <div class="modal-blue-filter modal-filter"></div>
                <div class="modal-green-filter modal-filter"></div>
                <div class="modal-yellow-filter modal-filter"></div>
            </div>
        </div>`)
        transModal = $(`<div class="transparent-modal"></div>`);

        $(".ticket-container").append(modal);
        $(".ticket-container").append(transModal);

        selectedPriority = "pink";
        modal.animate({
            "width": "45vw"
        }, 700);

        setTimeout(() => {
            transModal.animate({
                "width": "65vw"
            }, 150)
        }, 600)
        modalExists = true;

        let modalfilters = $(".modal-filter");
        $(modalfilters).each(function (index, item) {
            $(item).bind("click", selectPriority);
        });

        $(".cancel-btn").click(modalClose);

        $(".save-btn").click(addTicket);

    }
}

for (let i = 0; i < allFilters.length; i++) {
    $(allFilters[i]).click(filterHandler);
}
//..........change colour.......
function filterHandler(e) {
    //console.log($(".ticket-container").html());
    $(".ticket-container").html("");
    if  (e.currentTarget.classList.contains("active")) {
       $( e.currentTarget).removeClass("active");
       console.log(e.currentTarget);
        loadTickets();
    } else {
        let activeFIlter =$(".filter.active");
        if (activeFIlter) {
            activeFIlter.removeClass("active");
        }
        $(e.currentTarget).addClass("active");
        let ticketPriority = e.currentTarget.children[0].classList[0].split("-")[0];
        loadTickets(ticketPriority);
    }
}
    function selectPriority(e) {
        $(".modal-filter.active").removeClass("active");
        $(e.target).addClass("active");
        selectedPriority = e.target.classList[0].split("-")[1];
    }
//.......addTicket........
    function addTicket(e) {
        let id = uid();
        let text = $(".textarea").val();
        if (text == "") {
            alert("Error! you have not type anything in task.")
        }
        else {

        //     ticket = $(`<div class="ticket">
        //             <div class="priority-color priority-color-${selectedPriority}"></div>
        //             <div class="ticket-id">#${id}</div>
        //             <div class="task-container">${text}</div>
        //         </div>`);
        //     $(".ticket-container").append(ticket);
        // }
        // ticket.click(function (e) {
        //     if ($(e.currentTarget).hasClass("active")) {
        //         $(e.currentTarget).removeClass("active");
        //     } else {
        //         $(e.currentTarget).addClass("active");
        // //     }
        // });
        
        modalClose();

        let allTask = localStorage.getItem("allTask");
        if (allTask == null) {
            let data = [{ "ticketId": id, "task": text, "priority": selectedPriority }];
            localStorage.setItem("allTask", JSON.stringify(data));
        } else {
            let data = JSON.parse(allTask);
            data.push({ "ticketId": id, "task": text, "priority": selectedPriority });
            localStorage.setItem("allTask", JSON.stringify(data));
        }
        let activeFilter = $(".filter.active");
        //console.log(activeFilter[0]);
        $(".ticket-container").html("");
        if (activeFilter[0]) {
            let priority = selectedPriority;
            loadTickets(priority);
        } else {
            loadTickets();
        }
    }
}

    function modalClose(e) {
        transModal.animate({
            "width": "0vw"
        }, 250)
        setTimeout(() => {
            modal.animate({
                "width": "0vw"
            }, 800)
        }, 200)
        setTimeout(() => {
            modal.remove();
            transModal.remove();
        }, 900);
        modalExists = false;
    }

    $(".delete").click(removeTicket);
//.........removeTicket........
    function removeTicket(e) {
        let selectedTicket = $(".ticket.active");
        let allTask = JSON.parse(localStorage.getItem("allTask"));
        for (let i = 0; i < selectedTicket.length; i++) {
            selectedTicket[i].remove();
            let ticketID = selectedTicket[i].querySelector(".ticket-id").innerText;
            allTask = allTask.filter(function (data) {
                return (("#" + data.ticketId) != ticketID);
            });
        }
        localStorage.setItem("allTask", JSON.stringify(allTask));
    }
//.................info button click............
let info;
$(".info-btn").mouseover(function(){
    info=$(`<div class="info">
    <h2><u>Features:</u></h2>
	<ul>
		<li><b>Add Tasks:</b>Tasks can be added with the Add-button. Click '+' Icon.</li>
		<br />
		<li><b>Delete Tasks:</b>Tasks can be deleted with the delete-button. Click '-' Icon.</li>
		<br />
		<li>
			<b>Delete All Tasks:</b> Click Button present in the top
			right corner.
		</li>
		<br />
		<li><b>View All Tasks:</b> Double click any color in the Toolbar.</li>
		<br />
		<li><b>Change Color of a Task:</b> Click color bar of the Task Container.</li>
		<br />
		<li>
			<b>View Color specific Tasks:</b> Click that specific
			color in the Toolbar.
		</li>
		<br />		
		<li>
			<b>Setting Color of a Task:</b>
			After pressing '+' Icon, Enter description, then select the color for your task from the color palette.
		</li>
		<br />
        <li>
			<b>Each task is gnerated with a unique ID</b>
		</li>	
		<p>
			<b><i>*Don't worry! Your data will be stored for the next time you visit..</b>
		<i></i></p>
	</ul>
    </div>`)
    $(".ticket-container").append(info);
});
$(".info-btn").mouseout(function(){
  info.remove();
})

//............deleteAllTickets............
$(".deleteTicket").click(function(e){
    let ticketDelete = $(".ticket");
    for(let i = 0; i < ticketDelete.length; i++){
        $(ticketDelete[i]).addClass("active");
    }
    removeTicket();
});