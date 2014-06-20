/*
Developed by: Punit Shah
Purpose: Assignment
Reference used:
1) http://backbonejs.org/ (basics and to-do tutorial)
2) github API (json url to fetch list of open repository)
3) https://github.com/addyosmani/backbone-fundamentals (viewed and learned through examples)
*/


//Model object extends to use existing Backbone.Model
ModelRepo = Backbone.Model.extend({})

//Collection object
CollectionRepo = Backbone.Collection.extend({
    model: ModelRepo,
	//json url
    url: "https://api.github.com/users/7Geese/repos",
    
	initialize: function(){
		//sort collection
		this.sort();
    },
	comparator :  function(collection) {
		//descending sort on collection using field name forks
		return -collection.get('forks');
	}
});

//Template object referenced from html template 
TemplateRepo = _.template($("#repotemplate").html())

//View object
ViewsRepo = Backbone.View.extend({
	//element body
    el: $("body"),
    template: TemplateRepo,
    

    initialize: function () {
        this.collection.bind("reset", this.render, this);
		//add each item (json row)
        this.collection.bind("add", this.addRepoItem, this);
    },

	//render function
    render: function () {
        console.log("render")
        console.log(this.collection.length);
        $(this.el).html(this.template());
		//add item to collection
        this.addItemToCollection();
		
    },

	//adding item to collection
    addItemToCollection: function () {
        console.log("addItemToCollection")
        this.collection.each(this.addRepoItem);
	
    },

	//add single item
    addRepoItem: function (model) {
        console.log("addRepoItem")
        view = new ViewsRepoItem({ model: model });
        $("ul", this.el).append(view.render());
    }

})

//item template
TemplateRepoItem = _.template($("#repoitemtemplate").html())
//View object for item template
ViewsRepoItem = Backbone.View.extend({
	//items seperated by div tag
    tagName: "div",
    template: TemplateRepoItem,

    render: function () {
        return $(this.el).append(this.template(this.model.toJSON())) ;
    }
})

//Router for history //optional
Router = Backbone.Router.extend({
    routes: {
        "": "defaultRoute"  
    },

    defaultRoute: function () {
        console.log("defaultRoute");
        repositories = new CollectionRepo()
        new ViewsRepo({ collection: repositories }); 
        repositories.fetch();
        console.log(repositories.length)
    }
})

//declaration
var appRouter = new Router();
//start
Backbone.history.start();

