var ViewModel  = {
    Lists : ko.observableArray(),
    CreateList : function (formElement) {
        var $form = $(formElement);
        var listName = $form.find('#listName').val();
        if (listName) {
            var list = new List(listName, []);
            this.Lists.push(list);
            formElement.reset();
        }
    },
    IsNoListEditing : function () {
        var lists = this.Lists();
        for (var i = 0; i < lists.length; i++) {
            if (lists[i].isEditing()) {
                return false;   
            }
        }
        return true;
    }
};

// List object
function List (listName, listItems) {
    var self = this;
    
    // Object Fields
    self.listName = ko.observable(listName);
    self.isEditing = ko.observable(true);
    self.buttonText = ko.observable('Done');
    self.listItems = ko.observableArray(listItems);

    // Object Functions
    // Item sorting function, sorts from High -> Low
    self.sortedListItems = ko.computed(function () {
       return self.listItems().sort(function (left, right) {
           var left = left.itemPriority();
           var right = right.itemPriority();
            return (left == right ?
                0 :
                (left < right ? -1 : 1));
       });
    });

    // Removes an item from this list
    self.removeItem = function (itemToRemove) {
        self.listItems.remove(itemToRemove);
        if (self.listItems().length == 0)
            self.removeList();
    }


    
    // Insert a new item into this list
    self.insertNewItem = function (formElement) {
        var $form = $(formElement);
        var itemName = $form.find('#itemName').val();
        var itemPriority = $form.find('#itemPriority').val();

        if (itemName) {
            var listItem = new ListItem(itemName, itemPriority);
            self.listItems.push(listItem);
            formElement.reset();
        }
    }   

    // Removes this entire list from the ViewModel
    self.removeList = function () {
        ViewModel.Lists.remove(this);
    }

    // Displays editables and disable creating/editing another list
    self.editList = function () {
        self.isEditing(true);
    }

    self.doneEditing = function () {
        // Close all edit boxes
        for (var i = 0; i < self.listItems().length; i++) {
            var item = self.listItems()[i];
            item.showChangeBox(false);
            item.buttonText('Edit');
        }
        self.isEditing(false);
    }
};

// ListItem object
function ListItem (itemName, priority) {
    var self = this;
    
    // Fields
    self.itemName = ko.observable(itemName);
    self.itemPriority = ko.observable(priority);
    self.buttonText = ko.observable('Edit');
    self.showChangeBox = ko.observable(false);
    
    // Functions
    self.itemPriorityToString = {
        1 : 'High',
        2 : 'Medium',
        3 : 'Low'  
    }
    
    self.getPriorityString = function() {
        return self.itemPriorityToString[self.itemPriority()];
    }
    
    // Toggles button texts and edit boxes visibility
    self.onChangeItemName = function () {
        if (self.showChangeBox()) {
            self.showChangeBox(false); 
            self.buttonText('Edit');
        } else {
            self.showChangeBox(true);
            self.buttonText('Done');
        }
    }
}

// Init
ko.applyBindings(ViewModel);