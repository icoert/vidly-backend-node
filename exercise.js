const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 255,
        minlength: 5 
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network']
    },
    author: String,
    tags: [ String ],
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function () { return this.isPublished; },
        min: 5,
        max: 100
    }
});

const Course = mongoose.model('Course', courseSchema); // a class

async function createCourse(){
    const course = new Course({
        name: 'Angular Course',
        author: 'Mosh',
        tags: ['angular', 'frontend'],
        isPublished: true,
        price: 15,
        category: 'web'
    })

    course.validate
    const result = await course.save();
}

try {
    createCourse();
}
catch(exp) {
    console.log(exp)
}

async function getCourses(){
    const pageNumber = 2; // hard coded for simplicity
    const pageSize = 10;
    // /api/courses?pageNumber=2&pageSize=10 -> real world example

    // const courses = await Course.find({ author: 'Mosh', isPublished: true}).limit(10).sort({ name: 1 }).select({ name: 1, tags: 1 });
    const courses = await Course
                // .find({ author: 'Mosh', isPublished: true})
                // .find()
                // .or([ {author: 'Mosh' }, { isPublished: true }])
                // .and([])
                .find({ author: /^Mosh/ }) // a string that starts with Mosh
                .find({ author: /Hamedani$/i }) // a string that ends  with Hamedani key insensitive
                .find({ author: /.*Mosh.*/i }) // a string that contains a string
                // .find ({price: {$gte: 10, $lte: 20}}
                // .find({ price: { $in: [10, 15, 20] } })
                // .skip((pageNumber - 1 ) * pageSize) //skip all the documents of the previous page
                .limit(pageSize)
                // .limit(10)
                .count();
    console.log(courses)
}

async function updateCourse1 (id) {
    // Approach: Query first
    // find, modify and save
    const course = await Course.findById(id);

    if(!course) return;

    course.isPublished = true;
    course.author = 'Another Author'

    course.set({
        isPublished: true,
        author: 'Another Author'
    })

    const result = await course.save();

    console.log(result)
}

async function updateCourse2 (id) {
    // Approach: Update first
    // Update directly and optionally get the updated doc

    // const result = await Course.updateOne({ _id: id }, {
    //     $set: {
    //         author: 'New Author',
    //         isPublished: false
    //     }
    // });

    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'Jason',
            isPublished: true
        }
    }, {new: true}); // returns the original document, pass new argument to get back the updated doc

    console.log(course)
}

async function removeCourse (id) {
    // Course.deleteOne({ isPublished: false }) // find the first one and delete that
    const result = await Course.deleteOne({ _id: id })
    // const course = await Course.findByIdAndRemove(id)

    console.log(result)
}

// updateCourse2 ("6218aa91f1db72d6e553222d")

// getCourses();