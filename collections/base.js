"use strict";

/*
* Base Class for collections
*/

const
	when       = require('when'),
	Bookshelf  = require('../app').bookshelf;

Bookshelf.Collection = Bookshelf.Collection.extend({

	limit          : 10,

	total           : 0,

	currentpage     : 1,

	pages           : {},

	base            : '',

	paginationLimit : 10,

	whereQuery      : [],

	andWhereQuery   : [],

	order           : 'desc',

	Cache           : {},

	/*
	* Creates pagination data
	*
	* @returns: {Promiscollectione} - resolves with pagination
	*/ 
	makePages: function (totalRecords) {
		var self         = this;
		var totalpages   = Math.ceil(totalRecords / self.limit);
		var groups       = Math.ceil(totalpages / self.paginationLimit);
		var currentpage  = self.currentpage; 
		var items        = [];
		var prev         = currentpage - 1;
		var next         = currentpage + 1;
		var isFirstPage  = currentpage === 1;
		var lastpage     = totalpages;
		var isLastPage   = currentpage === lastpage;
		var highestF     = currentpage + 2;
		var lowestF      = currentpage - 2;
		var counterLimit = totalpages - 2; 


		if (groups > 1) {
			items.push(1);
			items.push(2);

			// if our current page is higher than 3
			if (lowestF > 3) {
				items.push('...');

			    //lets check if we our current page is towards the end
			    if (lastpage - currentpage < 2) {
			       lowestF -=  3; // add more previous links       
			    }

			} else {
				lowestF = 3; // lowest num to start looping from
			}

			for (var counter = lowestF; counter < lowestF + 5; counter++) {
				if (counter > counterLimit) {
					break;
				}

				items.push(counter);
			}
		    
			// if current page not towards the end
			if (highestF < totalpages - 2) {
				items.push('...');
			}

			items.push(lastpage - 1);
			items.push(lastpage);

		} else {
			// no complex pagination required
			for (var counter2 = 1; counter2 <= lastpage; counter2++) {
				items.push(counter2);
			}
		}
	  
	  
		var pages = {
			items       : items,
			currentpage : currentpage,
			base        : self.base,
			isFirstPage : isFirstPage,
			isLastPage  : isLastPage,
			next        : next,
			prev        : prev,
			total       : totalRecords,
			limit       : self.limit
		};

		self.pages = pages;

		return pages;
	},
 
	/*
	* Creates pagination data
	*
	* @returns: {Promiscollectione} - resolves with pagination
	*/ 
	paginate: function () {
		var self  = this;
		var query = self.model.forge().query();
		var totalpages = 0;

		if (self.whereQuery.length) {
			query.where(self.whereQuery[0], self.whereQuery[1], self.whereQuery[2]);
		}  

		if (self.andWhereQuery.length) {
			query.andWhere(self.andWhereQuery[0], self.andWhereQuery[1], self.andWhereQuery[2]);
		}

		return query.count('id AS total')
		.then(function (results) {
			totalpages = results[0].total;

			self.makePages(totalpages);

			return totalpages;
		});
	}
	
});

module.exports = Bookshelf;
