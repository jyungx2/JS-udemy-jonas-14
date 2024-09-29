'use strict';

const Person = function (firstName, birthYear) {
  console.log(this); // Pesron {}

  // 💡 Instance properties
  // will be available on all the instances that are created through this CF.
  this.firstName = firstName;
  this.birthYear = birthYear;
  // => 굳이 리턴 안해도 🆗
  // 리턴해도 문제가 되진 않지만, return에 의해 반환되는 값이 기초 데이터인지 객체인지에 따라 차이가 있다.
  // 기초데이터를 리턴시키면 자동으로 생성된 오브젝트가 리턴되고, 오브젝트를 리턴시키면 개발자가 어떤 의도가 있겠지 하면서 자동으로 생성된 오브젝트는 무시되고 리턴시킨 오브젝트만 반환된다.

  // 💡 What if we wanted to add a method to our objects?
  // ❗️❗️ Never create a method inside of a constructor function.
  // 수천,수백개의 오브젝트가 필요할 때, 이런 식으로 다 copy할 순 없으니까!
  // >> that would be terrible for the performance of our code.
  // ✅ prototypes & prototype inheritance 를 이용할 것이다. (201 강의)
  // this.calcAge = function () {
  //   console.log(2037 - this.birthYear);
  // };
};

const jonas = new Person('Jonas', 1991);
console.log(jonas); // Person {firstName: 'Jonas', birthYear: 1991}
const matilda = new Person('Matilda', 2017);
const jack = new Person('Jack', 1975);
console.log(matilda, jack);
const jay = 'Jay';
console.log(jay instanceof Person); // false - Person이라는 생성자함수로 jay라는 오브젝트를 만들지 않았으므로.
// becasue we didn't create this varibale(jay).
console.log(jonas instanceof Person); // true

console.log(Person.prototype); // {constructor: ƒ}

// 216. static methods
Person.hey = function () {
  console.log(`Hey there 👍`);
  console.log(this);
};
Person.hey();
// jonas.hey(); // error comes up bc it's simply not in the prototype of the Jonas object.
// jonas object가 hey() 함수를 상속할 수 있는 방법이 없다!

Person.prototype.calcAge = function () {
  console.log(2037 - this.birthYear); // this > object 가리키게 돼있음.
};

console.log(Person.prototype); // {calcAge: ƒ, constructor: ƒ}
// prototype object에 calcAge라는 method 추가됨!

jonas.calcAge(); // 46
matilda.calcAge(); // 20
// 💡 Each object has a special property called __proto__. (= prototype of jonas not the prototype property)
console.log(jonas.__proto__); // {calcAge: ƒ, constructor: ƒ}

console.log(jonas.__proto__ === Person.prototype); // true

console.log(Person.prototype.isPrototypeOf(jonas)); // true
console.log(Person.prototype.isPrototypeOf(matilda)); // true
console.log(Person.prototype.isPrototypeOf(Person)); // false

console.log(jonas.__proto__ === Person.prototype);
// console.log(jonas.hasOwnProperty(firstName)); // true
// console.log(jonas.hasOwnProperty(species)); // false

console.log(Person.prototype);
console.log(Person.prototype.__proto__);

Person.prototype.species = 'Homo Sapiens';
console.log(jonas, matilda);
// Person {firstName: 'Jonas', birthYear: 1991} Person {firstName: 'Matilda', birthYear: 2017}
console.log(jonas.species, matilda.species);
console.log(jonas.hasOwnProperty('firstName')); // true
console.log(jonas.hasOwnProperty('species'));

console.log(jonas.__proto__); // Object {species: 'Homo Sapiens', calcAge: ƒ}
console.log(jonas.__proto__.__proto__); // 생성자함수의 프로토타입 자체도 객체이므로 이것의 프로토타입 = 최상위 객체인 Object.prototype
console.log(jonas.__proto__.__proto__.__proto__); // null

console.dir(Person.prototype.constructor); // Person 생성자 함수 출력.

const arr = [3, 6, 6, 5, 6, 9, 3]; // new Array === []
console.log(arr.__proto__); // array도 객체이므로 자신만의 prototype(=__proto__)를 갖는다.
console.log(arr.__proto__ === Array.prototype); // true
console.log(arr.__proto__.__proto__); // Object.prototype
console.log(arr.__proto__.__proto__ === Object.prototype); // true (어레이도 결국 오브젝트의 한 종류니까!!)

// mdn에 array method를 검색했을 때, Array.prototype.filter()라고 나오는 이유도, 사실은 우리가 무의식적으로 만들어진 어레이 상에 직접 메서드를 불러오는 것처럼 생각하고 쓰는 filte()메서드는 각각의 어레이마다 filter()라는 메서드를 가지고 있는 것이 아니라, Array라는 생성자함수의 프로토타입에 정의된 것을 프로토타입 체인에 의해 각각의 어레이들이 상속받아 쓰는 것이라 그렇다.

// 이렇게 우리 나름대로 새로운 메서드를 생성자함수 프로토타입에 정의하여 모든 어레이에 상속받아 쓸 수 있지만(=extending prototype of 내장객체), 좋은 방법은 아니다.
// 작은 프로젝트 상에선 괜찮을 수 있지만, 여러 팀원들과 큰 프로젝트를 진행하는 상황이라면, 여러 사람이 같은 네임의 메서드를 생성할 수도 있고, 다음 버전의 자바스크립트에서 동일한 이름의 메서드가 추가되어 나올수도 있기 때문이다.
Array.prototype.unique = function () {
  return [...new Set(this)];
};

console.log(arr.unique()); // [3, 6, 5, 9]

// Coding Challenge #1
// 1.
const Car = function (make, speed) {
  this.make = make;
  this.speed = speed;
};

// 2.
Car.prototype.accelerate = function () {
  this.speed += 10;
  console.log(this.speed);
  console.log(`${this.make} is going at ${this.speed}`);
};

// 3.
Car.prototype.brake = function () {
  this.speed -= 5;
  console.log(this.speed);
  console.log(`${this.make} is going at ${this.speed}`);
};

// 5.
const bmw = new Car('BMW', 120);
const mercedes = new Car('Mercedes', 95);
console.log(bmw, mercedes);

bmw.accelerate();
mercedes.accelerate();
bmw.brake();
mercedes.brake();

// 생성자함수 내에 this 키워드를 이용해 선언한 프라퍼티는 true
console.log(bmw.hasOwnProperty('make')); // true
console.log(bmw.hasOwnProperty('speed')); // true

// prototypal inherit으로 받아온 메서드는 자기 객체 안에 정의되어 있지 않는다!!
console.log(bmw.hasOwnProperty('accelerate')); // false
console.log(bmw.hasOwnProperty('brake')); // false

// 214. ES6 Classes

// * class expression (hoisting ❌)
// const PersonCl = class {}

// * class declaration
class PersonCl {
  constructor(fullName, birthYear) {
    this.fullName = fullName; // firstName -> fullName
    this.birthYear = birthYear;
  }

  // Instance method (=> all the instances can access to these methods)
  // 🌟 Methods will be added to .prototype property of class('PersonCl')
  // constructor 함수 바깥에 쓰는 멤버들은 PersonCl의 Prototype에 저장된다.
  // this(객체) 상에 저장되지 않고, PersonCl에 의해 만들어진 모든 객체가 공유할 수 있는 값으로 선언됨.
  calcAge() {
    console.log(2037 - this.birthYear);
  }

  greet() {
    console.log(`Hey ${this.fullName}`);
  }

  // 215. Setters and Getters
  get age() {
    return 2037 - this.birthYear;
  }
  // => prototype에 설정해준 어느 regular method와 동일하게 작동

  // These getter and setter can be very useful in ✨Data validation✨!
  // 📌 Set a property that already exists
  // setter의 네임을 이미 정의한 property name(=fullName)과 동일하게 지어줬다.
  // 이말인 즉슨, this 키워드로 fullName을 세팅할 때마다 이 setter가 불러와지고,
  // name 매개변수 자리에 입력한 fullName이 들어간다. (ex. jessica, jack, jonas...)
  set fullName(name) {
    console.log(name); // => CRAZY ERROR 발생!! conflict 발생 - constructor 함수와 setter function이 같은 프라퍼티 (name)을 세팅하려고 해서.. => 이러한 컨플릭을 막기 위해서 우리는 convention으로서 쓰이는 _(underscore)를 fullName앞에 넣어주어 naming conflict를 방지한다.
    if (name.includes(' ')) this._fullName = name;
    else alert(`${name} is not a full name!`);
  }

  //  위의 setter 프라퍼티를 이용해 어떤 밸류를 이미 존재하는 프라퍼티 네임과 동일하게 this에 선언해주면 에러가 발생하기 때문에, unserscore(_)를 써주어 새로운 프라퍼티 네임을 만들어낸다. =>  _fullName: 'Jessica Davis'과, fullName: 'Jessica Davis' 두 프라퍼티가 모두 존재하게 된다.

  // jessica.fullName = undefined.
  // 💥세터 프라퍼티는 동일한 프라퍼티 이름이 선언될 때마다만 실행되며, 리턴되진 않는다. 즉 리턴하려면 이와 같이 getter를 선언해줘야 한다.💥 따라서 다음과 같은 Get 프라퍼티로 _fullName으로 선언된 멤버를 다시 fullName으로 가져올 수 있게끔 선언해준다.

  // 단지 우리는 fullName 세터에서 constructor함수 내에 이미 존재하는 프라퍼티 네임을 가져올 때 생기는 conflict를 막기 위해 설정한 '_fullName'라는 이름의 프라퍼티에서 '_'를 포함하지 않는, 'fullName'으로 접근할 수 있게 get 프라퍼티를 이용해 가져온 것!! => jesscia.fullName = Jessica Davis가 뜨게 됨.
  get fullName() {
    return this._fullName;
  }

  // 🌟 Static method (= all the objects that constructor inside of this class generated cannot access to this static method)
  static hey() {
    console.log(`Hey there 👍`);
    console.log(this);
  }
}
const jesscia = new PersonCl('Jessica Davis', 1996);
console.log(jesscia); // {firstName: 'Jessica', birthYear: 1996}
jesscia.calcAge(); // 41
console.log(jesscia.__proto__ === PersonCl.prototype); // true

// 🌟 prove) greet()함수를 class안에 적든, 아래처럼 작성하든, 똑같이 적용된다!
// PersonCl.prototype.greet = function () {
//   console.log(`Hey, ${this.fullName}`);
// };
jesscia.greet();

// 1. Classes are Not hoisted.
// 2. Class are first-class citizens
// 3. Classes are executed in strict mode.

// 🌟 Static method
PersonCl.hey();

// 215. calling setter and getter!
// 꼭 알아둬야 할 필수개념은 아니고, 사용빈도는 적지만, 가끔씩 유용하게 쓰일 때가 있으니 알아두자!
console.log(jesscia);
console.log(jesscia.age); // 41
console.log(jesscia.fullName); // Jessica Davis
console.log(jesscia._fullName); // Jessica Davis

const walter = new PersonCl('Walter White', 1965); // 그냥 Walter라고만 써주면 alert 발생!
// 일종의 data validation을 할 수 있는, setter function으로 if-else절을 대체하여 데이터를 잘 입력했는지,(지금은 매개변수를 잘 입력했는지) 검증하고, 아니라면 alert(경고 메시지)를 뿌린 후, 데이터가 저장되지 않게, 잘 입력했다면, 해당 데이터가 객체 안에 _fullName이라는 프라퍼티로 저장되고,(this키워드로 fullName을 이미 위에서 선언해줬지만은, 이와 동일한 프라퍼티를 설정하는 setter function이 실행되면서 fullName이 아닌, _fullName으로 약간 덮어쓰기되어 저장되는 느낌쓰.. => jesscia(this).fullName = undefined 출력
// 근데 우리는 _fullName이 아닌, fullName으로 데이터를 불러오고 싶기 때문에, getter function을 이용하여 다시 한번 _fullName으로 저장된 프라퍼티 밸류를 fullName으로 가져올 수 있게끔 선언해준 것. (get fullName)
console.log(walter.age); // 72
console.log(walter.fullName); // Walter White
console.log(walter._fullName); // Walter White

// 215. Setters and Getters
const account = {
  owner: 'Jonas',
  movements: [200, 530, 120, 300],

  get latest() {
    return this.movements.slice(-1).pop();
  },

  // 세터 메소드는 하나의 매개변수를 가질 필요가 있다.
  set latest(mov) {
    this.movements.push(mov);
  },
};

// 📌 Getter 프라퍼티
// 함수 형태로 썼지만, 마치 프라퍼티인 것마냥 .만 찍구 불러올 수 있다!
// >> 이러한 Get 함수는 어떤 값을 프라퍼티로서 읽을 때 매우 유용하다.
console.log(account.latest); // 300

// 📌 Setter 프라퍼티
// 메서드가 아닌 프라퍼티이기 때문에 이렇게 쓰면 안된다!
// account.latest(50)
account.latest = 50;
console.log(account.movements); // [200, 530, 120, 300, 50]

// 자바스크립트 내 모든 객체는 setter, getter property를 갖는다.
// 우리는 이 둘을 특별한 assessor properties라고 부르고, 이들과 다르게 평범한 프라퍼티는 데이터 프라퍼티라고 한다.
// getter, setter은 이름처럼 기본적으로 밸류를 가져오거나 세팅하는 함수이지만, 겉으로는 그냥 일반적인 프라퍼티처럼 보인다.
// 일반 객체뿐만 아니라, class(=생성자함수와 비슷) 또한 getter, setter를 갖고, 객체 내에서의 Getter, setter가 작동하는 방식과 동일하게 동작한다!

// 217. Object.create()
const Personproto = {
  calcAge() {
    console.log(2037 - this.birthYear);
  },

  // steven.name / steve.birthYear처럼 그 객체에 직접 정의내리는 것보다,
  // Personproto 프로토타입 자체 내에서 다 처리하도록 하는게 더 효율적!
  // => 마치 class내 constructor function 형태와 똑같이 생겼다. (아무 관련은 없다!!)
  // * init => this could be any name!
  init(firstName, birthYear) {
    this.firstName = firstName;
    this.birthYear = birthYear;
  },
};

// Object.create creates a new object, and the prototype of that object will be the object that we passed in(= Personproto).
const steven = Object.create(Personproto);
console.log(steven);
// steven.name = 'Steven';
// steven.birthYear = 2002;
steven.init('Steven', 2002);
steven.calcAge();

console.log(steven.__proto__ === Personproto); // true

const sarah = Object.create(Personproto);
sarah.init('Sarah', 1979);
sarah.calcAge(); // 58

// Coding challenge #2
class Car2 {
  constructor(make, speed) {
    this.make = make;
    this.speed = speed;
  }

  accelerate() {
    this.speed += 10;
    console.log(`${this.make} is going at ${this.speed}`);
  }

  brake() {
    this.speed -= 5;
    console.log(`${this.make} is going at ${this.speed}`);
  }

  get speedUS() {
    return this.speed / 1.6;
  }

  set speedUS(speed) {
    this.speed = speed * 1.6;
  }
}

const bmw2 = new Car2('BMW', 120);
const mercedes2 = new Car2('Mercedes', 95);
console.log(bmw2, mercedes2);

bmw2.accelerate();
mercedes2.accelerate();
bmw2.brake();
mercedes2.brake();

const ford = new Car2('Ford', 120);
// getter function (Actually property)
console.log(ford.speedUS); // 75
ford.accelerate();
ford.brake();
ford.brake();

// setter function (Actually property)
ford.speedUS = 50;
console.log(ford); // 80 = 50 * 1.6

// 219. Inheritance between 'Classes': Constructor Functions
const Human = function (firstName, birthYear) {
  this.firstName = firstName;
  this.birthYear = birthYear;
};

Human.prototype.calcAge = function () {
  console.log(2037 - this.birthYear);
};

const Student = function (firstName, birthYear, course) {
  // These parts are simple copy of the person function constructor.
  // => duplicate code is a bad practice always!! => ✨Let's simply call the Person function!✨
  //   this.firstName = firstName;
  //   this.birthYear = birthYear;
  Person.call(this, firstName, birthYear); // this keyword = undefined
  // 여기서 Person 생성자함수는 그냥 일반 함수로서 불러와지고 있다. 일반 함수의 this = undefined.
  // 우리는 This keyword를 매뉴얼리하게 설정해줄 필요가 있다!! -> 'call/apply/bind' method 이용
  this.course = course;
};

// 💫 Linking prototype
Student.prototype = Object.create(Human.prototype); // object.create() will return empty object + add methods (introduce)
// 🚨 이때, 만약 아래에 introduce 메서드 추가 부분을 이 코드보다 더 먼저 작성했을 시, 추가한 다음에 다시 빈 오브젝트로 설정하는 것이므로, 제대로 동작하지 않을 것임. (코드 작성 순서 주의하자!!)

// ❌ 이 코드는 제대로 동작 하지 않음. (현강에선 이 방법으로 하셨는데..) ❌
// Student.prototype = Person.prototype;
// => 완전히 잘못된 prototype chain을 얻게 되므로, 절대 쓰면 안되는 BAD CODE.
// 우리가 원하는 prototype chain의 구조는 human.prototype이 student prototype(=mike.__proto__)의 prototype이 되게 하는 것. 즉 우리는 student의 프로토타입이 human 프로토타입을 inherit하게 하는 것이지, 이 둘의 프로토타입이 완전히 같은 객체를 가리키게 하는 것이 아니다!! (그림으로 보면 이해 쉬움.)

Student.prototype.introduce = function () {
  console.log(`My name is ${this.firstName}, and I study ${this.course}`);
};

const mike = new Student('Mike', 2020, 'Computer Science');
console.log(mike); // Student {firstName: 'Mike', birthYear: 2020, course: 'Computer Science'}
mike.introduce();
mike.calcAge(); // 17  💫 After linking prototype, now this works! (bc, calcAge() is in Human.prototype)

// 이제 Student prototype과 Human prototype을 .__proto__로 접근할 수 있도록 연결시키고 싶다!
// human.prototype에 있는 모든 멤버(프라퍼티/메서드)를 student에 의해 만들어진 객체들이 모두 공유할 수 있도록 하기 위해..
// => 우리가 원하는 prototype을 직접 설정할 수 있는 방법이 뭐가 있을까?... 새로운 객체를 생성하는데, 프로토타입을
// 우리가 원하는대로 매뉴얼리하게 정의할 수 있는 Obejct.create()을 쓰면 딱 좋겠지!!💫

console.log(mike.__proto__); // 💥Human {introduce: f} => 💥Student.prototype.introduce ..needed to be fixed!
console.log(mike.__proto__.__proto__); // calcAge() => Human.prototype.calcAge = function() {} 코드 때문.

// 💥this is needed to be fixed.
console.log(Student.prototype.constructor); // Human function -> this should point back to the 💥Student💥
// -> 이렇게 나오는 이유는, student의 prototype property를 Object.create()을 이용해 Human.prototype으로 세팅해줬기 때문이다. 이게 studnet.prototype의 constructor가 Human인 이유...
// Student.prototype에서 다시 constructor로 돌아가면 다시 원래의 생성자 함수인 Student가 나오는게 맞다. 그런데 여기선 더 상위의 상속받는 Human function constructor가 출력된다.. 이는 처음에 객체 생성할 때, Object.create()로 Student.prototype을 Human.prototype으로 설정해주어
console.log(mike.__proto__ === Student.prototype); // true
console.log(mike.__proto__.__proto__ === Human.prototype); // true
