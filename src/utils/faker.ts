import _ from "lodash";
import dayjs from "dayjs";

interface Users {
  name: string;
  gender: string;
  email: string;
}

interface Products {
  name: string;
  category: string;
}

interface Categories {
  name: string;
  tags: string;
  slug: string;
}

interface News {
  title: string;
  superShortContent: string;
  shortContent: string;
  content: string;
}

interface Files {
  fileName: string;
  type: string;
  size: string;
}

interface Foods {
  name: string;
  image: string;
}

interface Country {
  name: string;
  code: string;
}

const imageAssets = import.meta.glob<{
  default: string;
}>("/src/assets/images/fakers/*.{jpg,jpeg,png,svg}", { eager: true });

const fakers = {
  fakeUsers() {
    const users: Array<Omit<Users, "email">> = [
      { name: "Johnny Depp", gender: "male" },
      { name: "Al Pacino", gender: "male" },
      { name: "Robert De Niro", gender: "male" },
      { name: "Kevin Spacey", gender: "male" },
      { name: "Denzel Washington", gender: "male" },
      { name: "Russell Crowe", gender: "male" },
      { name: "Brad Pitt", gender: "male" },
      { name: "Angelina Jolie", gender: "female" },
      { name: "Leonardo DiCaprio", gender: "male" },
      { name: "Tom Cruise", gender: "male" },
      { name: "John Travolta", gender: "male" },
      { name: "Arnold Schwarzenegger", gender: "male" },
      { name: "Sylvester Stallone", gender: "male" },
      { name: "Kate Winslet", gender: "female" },
      { name: "Christian Bale", gender: "male" },
      { name: "Morgan Freeman", gender: "male" },
      { name: "Keanu Reeves", gender: "male" },
      { name: "Nicolas Cage", gender: "male" },
      { name: "Hugh Jackman", gender: "male" },
      { name: "Edward Norton", gender: "male" },
      { name: "Bruce Willis", gender: "male" },
      { name: "Tom Hanks", gender: "male" },
      { name: "Charlize Theron", gender: "female" },
      { name: "Will Smith", gender: "male" },
      { name: "Sean Connery", gender: "male" },
      { name: "Keira Knightley", gender: "female" },
      { name: "Vin Diesel", gender: "male" },
      { name: "Matt Damon", gender: "male" },
      { name: "Richard Gere", gender: "male" },
      { name: "Catherine Zeta-Jones", gender: "female" },
    ];

    return _.sampleSize(users, 3).map((user) => {
      return {
        name: user.name,
        gender: user.gender,
        email: _.toLower(_.replace(user.name, / /g, "") + "@left4code.com"),
      };
    });
  },
  fakePhotos() {
    const photos = [];
    for (let i = 0; i < 15; i++) {
      photos[photos.length] =
        imageAssets[
          "/src/assets/images/fakers/profile-" + _.random(1, 15) + ".jpg"
        ].default;
    }
    return _.sampleSize(photos, 10);
  },
  fakeImages() {
    const images = [];
    for (let i = 0; i < 15; i++) {
      images[images.length] =
        imageAssets[
          "/src/assets/images/fakers/preview-" + _.random(1, 15) + ".jpg"
        ].default;
    }
    return _.sampleSize(images, 10);
  },
  fakeDates() {
    const dates = [];
    for (let i = 0; i < 5; i++) {
      dates[dates.length] = dayjs
        .unix(_.random(1586584776897, 1672333200000) / 1000)
        .format("DD MMMM YYYY");
    }
    return _.sampleSize(dates, 3);
  },
  fakeTimes() {
    const times = [
      "01:10 PM",
      "05:09 AM",
      "06:05 AM",
      "03:20 PM",
      "04:50 AM",
      "07:00 PM",
    ];
    return _.sampleSize(times, 3);
  },
  fakeFormattedTimes() {
    const times = [
      _.random(10, 60) + " seconds ago",
      _.random(10, 60) + " minutes ago",
      _.random(10, 24) + " hours ago",
      _.random(10, 20) + " days ago",
      _.random(10, 12) + " months ago",
    ];
    return _.sampleSize(times, 3);
  },
  fakeTotals() {
    return _.shuffle([_.random(20, 220), _.random(20, 120), _.random(20, 50)]);
  },
  fakeTrueFalse() {
    return _.sampleSize([false, true, true], 1);
  },
  fakeStocks() {
    return _.shuffle([_.random(50, 220), _.random(50, 120), _.random(50, 50)]);
  },
  fakeProducts() {
    const products = [
      { name: "Dell XPS 13", category: "PC & Laptop" },
      { name: "Apple MacBook Pro 13", category: "PC & Laptop" },
      { name: "Oppo Find X2 Pro", category: "Smartphone & Tablet" },
      { name: "Samsung Galaxy S20 Ultra", category: "Smartphone & Tablet" },
      { name: "Sony Master Series A9G", category: "Electronic" },
      { name: "Samsung Q90 QLED TV", category: "Electronic" },
      { name: "Nike Air Max 270", category: "Sport & Outdoor" },
      { name: "Nike Tanjun", category: "Sport & Outdoor" },
      { name: "Nikon Z6", category: "Photography" },
      { name: "Sony A7 III", category: "Photography" },
    ];
    return _.shuffle(products);
  },
  fakeCategories() {
    const categories = [
      { name: "PC & Laptop", tags: "Apple, Asus, Lenovo, Dell, Acer" },
      {
        name: "Smartphone & Tablet",
        tags: "Samsung, Apple, Huawei, Nokia, Sony",
      },
      { name: "Electronic", tags: "Sony, LG, Toshiba, Hisense, Vizio" },
      {
        name: "Home Appliance",
        tags: "Whirlpool, Amana, LG, Frigidaire, Samsung",
      },
      { name: "Photography", tags: "Canon, Nikon, Sony, Fujifilm, Panasonic" },
      { name: "Fashion & Make Up", tags: "Nike, Adidas, Zara, H&M, Levi’s" },
      {
        name: "Kids & Baby",
        tags: "Mothercare, Gini & Jony, H&M, Babyhug, Liliput",
      },
      { name: "Hobby", tags: "Bandai, Atomik R/C, Atlantis Models, Carisma" },
      {
        name: "Sport & Outdoor",
        tags: "Nike, Adidas, Puma, Rebook, Under Armour",
      },
    ];

    return _.sampleSize(categories, 3).map((category) => {
      return {
        name: category.name,
        tags: category.tags,
        slug: _.replace(
          _.replace(_.toLower(category.name), / /g, "-"),
          "&",
          "and"
        ),
      };
    });
  },
  fakeNews() {
    const news = [
      {
        title: "Desktop publishing software like Aldus PageMaker",
        superShortContent: _.truncate(
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          {
            length: 30,
            omission: "",
          }
        ),
        shortContent: _.truncate(
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          {
            length: 150,
            omission: "",
          }
        ),
        content:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      },
      {
        title: "Dummy text of the printing and typesetting industry",
        superShortContent: _.truncate(
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
          {
            length: 30,
            omission: "",
          }
        ),
        shortContent: _.truncate(
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
          {
            length: 150,
            omission: "",
          }
        ),
        content:
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
      },
      {
        title: "Popularised in the 1960s with the release of Letraset",
        superShortContent: _.truncate(
          'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',
          {
            length: 30,
            omission: "",
          }
        ),
        shortContent: _.truncate(
          'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',
          {
            length: 150,
            omission: "",
          }
        ),
        content:
          'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',
      },
      {
        title: "200 Latin words, combined with a handful of model sentences",
        superShortContent: _.truncate(
          "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
          {
            length: 50,
            omission: "",
          }
        ),
        shortContent: _.truncate(
          "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
          {
            length: 150,
            omission: "",
          }
        ),
        content:
          "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
      },
    ];
    return _.shuffle(news);
  },
  fakeFiles() {
    const files = [
      { fileName: "Celine Dion - Ashes.mp4", type: "MP4", size: "20 MB" },
      { fileName: "Laravel 7", type: "Empty Folder", size: "120 MB" },
      { fileName: fakers.fakeImages()[0], type: "Image", size: "1.2 MB" },
      { fileName: "Repository", type: "Folder", size: "20 KB" },
      { fileName: "Resources.txt", type: "TXT", size: "2.2 MB" },
      { fileName: "Routes.php", type: "PHP", size: "1 KB" },
      { fileName: "Dota 2", type: "Folder", size: "112 GB" },
      { fileName: "Documentation", type: "Empty Folder", size: "4 MB" },
      { fileName: fakers.fakeImages()[0], type: "Image", size: "1.4 MB" },
      { fileName: fakers.fakeImages()[0], type: "Image", size: "1 MB" },
    ];
    return _.shuffle(files);
  },
  fakeJobs() {
    const jobs = [
      "Frontend Engineer",
      "Software Engineer",
      "Backend Engineer",
      "DevOps Engineer",
    ];
    return _.shuffle(jobs);
  },
  fakeNotificationCount() {
    return _.random(1, 7);
  },
  fakeFoods() {
    const foods = [
      {
        name: "Vanilla Latte",
        image:
          imageAssets["/src/assets/images/fakers/food-beverage-1.jpg"].default,
      },
      {
        name: "Milkshake",
        image:
          imageAssets["/src/assets/images/fakers/food-beverage-2.jpg"].default,
      },
      {
        name: "Soft Drink",
        image:
          imageAssets["/src/assets/images/fakers/food-beverage-3.jpg"].default,
      },
      {
        name: "Root Beer",
        image:
          imageAssets["/src/assets/images/fakers/food-beverage-4.jpg"].default,
      },
      {
        name: "Pocari",
        image:
          imageAssets["/src/assets/images/fakers/food-beverage-5.jpg"].default,
      },
      {
        name: "Ultimate Burger",
        image:
          imageAssets["/src/assets/images/fakers/food-beverage-6.jpg"].default,
      },
      {
        name: "Hotdog",
        image:
          imageAssets["/src/assets/images/fakers/food-beverage-7.jpg"].default,
      },
      {
        name: "Avocado Burger",
        image:
          imageAssets["/src/assets/images/fakers/food-beverage-8.jpg"].default,
      },
      {
        name: "Spaghetti Fettucine Aglio with Beef Bacon",
        image:
          imageAssets["/src/assets/images/fakers/food-beverage-9.jpg"].default,
      },
      {
        name: "Spaghetti Fettucine Aglio with Smoked Salmon",
        image:
          imageAssets["/src/assets/images/fakers/food-beverage-10.jpg"].default,
      },
      {
        name: "Curry Penne and Cheese",
        image:
          imageAssets["/src/assets/images/fakers/food-beverage-11.jpg"].default,
      },
      {
        name: "French Fries",
        image:
          imageAssets["/src/assets/images/fakers/food-beverage-12.jpg"].default,
      },
      {
        name: "Virginia Cheese Fries",
        image:
          imageAssets["/src/assets/images/fakers/food-beverage-13.jpg"].default,
      },
      {
        name: "Virginia Cheese Wedges",
        image:
          imageAssets["/src/assets/images/fakers/food-beverage-14.jpg"].default,
      },
      {
        name: "Fried/Grilled Banana",
        image:
          imageAssets["/src/assets/images/fakers/food-beverage-15.jpg"].default,
      },
      {
        name: "Crispy Mushroom",
        image:
          imageAssets["/src/assets/images/fakers/food-beverage-16.jpg"].default,
      },
      {
        name: "Fried Calamari",
        image:
          imageAssets["/src/assets/images/fakers/food-beverage-17.jpg"].default,
      },
      {
        name: "Chicken Wings",
        image:
          imageAssets["/src/assets/images/fakers/food-beverage-18.jpg"].default,
      },
      {
        name: "Snack Platter",
        image:
          imageAssets["/src/assets/images/fakers/food-beverage-19.jpg"].default,
      },
    ];
    return _.shuffle(foods);
  },
  fakerCountry() {
    const country =[
      {
        name: "Afghanistan",
        code: "AF"
      },
      {
        name: "Åland Islands",
        code: "AX"
      },
      {
        name: "Albania",
        code: "AL"
      },
      {
        name: "Algeria",
        code: "DZ"
      },
      {
        name: "American Samoa",
        code: "AS"
      },
      {
        name: "AndorrA",
        code: "AD"
      },
      {
        name: "Angola",
        code: "AO"
      },
      {
        name: "Anguilla",
        code: "AI"
      },
      {
        name: "Antarctica",
        code: "AQ"
      },
      {
        name: "Antigua and Barbuda",
        code: "AG"
      },
      {
        name: "Argentina",
        code: "AR"
      },
      {
        name: "Armenia",
        code: "AM"
      },
      {
        name: "Aruba",
        code: "AW"
      },
      {
        name: "Australia",
        code: "AU"
      },
      {
        name: "Austria",
        code: "AT"
      },
      {
        name: "Azerbaijan",
        code: "AZ"
      },
      {
        name: "Bahamas",
        code: "BS"
      },
      {
        name: "Bahrain",
        code: "BH"
      },
      {
        name: "Bangladesh",
        code: "BD"
      },
      {
        name: "Barbados",
        code: "BB"
      },
      {
        name: "Belarus",
        code: "BY"
      },
      {
        name: "Belgium",
        code: "BE"
      },
      {
        name: "Belize",
        code: "BZ"
      },
      {
        name: "Benin",
        code: "BJ"
      },
      {
        name: "Bermuda",
        code: "BM"
      },
      {
        name: "Bhutan",
        code: "BT"
      },
      {
        name: "Bolivia",
        code: "BO"
      },
      {
        name: "Bosnia and Herzegovina",
        code: "BA"
      },
      {
        name: "Botswana",
        code: "BW"
      },
      {
        name: "Bouvet Island",
        code: "BV"
      },
      {
        name: "Brazil",
        code: "BR"
      },
      {
        name: "British Indian Ocean Territory",
        code: "IO"
      },
      {
        name: "Brunei Darussalam",
        code: "BN"
      },
      {
        name: "Bulgaria",
        code: "BG"
      },
      {
        name: "Burkina Faso",
        code: "BF"
      },
      {
        name: "Burundi",
        code: "BI"
      },
      {
        name: "Cambodia",
        code: "KH"
      },
      {
        name: "Cameroon",
        code: "CM"
      },
      {
        name: "Canada",
        code: "CA"
      },
      {
        name: "Cape Verde",
        code: "CV"
      },
      {
        name: "Cayman Islands",
        code: "KY"
      },
      {
        name: "Central African Republic",
        code: "CF"
      },
      {
        name: "Chad",
        code: "TD"
      },
      {
        name: "Chile",
        code: "CL"
      },
      {
        name: "China",
        code: "CN"
      },
      {
        name: "Christmas Island",
        code: "CX"
      },
      {
        name: "Cocos (Keeling) Islands",
        code: "CC"
      },
      {
        name: "Colombia",
        code: "CO"
      },
      {
        name: "Comoros",
        code: "KM"
      },
      {
        name: "Congo",
        code: "CG"
      },
      {
        name: "Congo, The Democratic Republic of the",
        code: "CD"
      },
      {
        name: "Cook Islands",
        code: "CK"
      },
      {
        name: "Costa Rica",
        code: "CR"
      },
      {
        name: "Cote D'Ivoire",
        code: "CI"
      },
      {
        name: "Croatia",
        code: "HR"
      },
      {
        name: "Cuba",
        code: "CU"
      },
      {
        name: "Cyprus",
        code: "CY"
      },
      {
        name: "Czech Republic",
        code: "CZ"
      },
      {
        name: "Denmark",
        code: "DK"
      },
      {
        name: "Djibouti",
        code: "DJ"
      },
      {
        name: "Dominica",
        code: "DM"
      },
      {
        name: "Dominican Republic",
        code: "DO"
      },
      {
        name: "Ecuador",
        code: "EC"
      },
      {
        name: "Egypt",
        code: "EG"
      },
      {
        name: "El Salvador",
        code: "SV"
      },
      {
        name: "Equatorial Guinea",
        code: "GQ"
      },
      {
        name: "Eritrea",
        code: "ER"
      },
      {
        name: "Estonia",
        code: "EE"
      },
      {
        name: "Ethiopia",
        code: "ET"
      },
      {
        name: "Falkland Islands (Malvinas)",
        code: "FK"
      },
      {
        name: "Faroe Islands",
        code: "FO"
      },
      {
        name: "Fiji",
        code: "FJ"
      },
      {
        name: "Finland",
        code: "FI"
      },
      {
        name: "France",
        code: "FR"
      },
      {
        name: "French Guiana",
        code: "GF"
      },
      {
        name: "French Polynesia",
        code: "PF"
      },
      {
        name: "French Southern Territories",
        code: "TF"
      },
      {
        name: "Gabon",
        code: "GA"
      },
      {
        name: "Gambia",
        code: "GM"
      },
      {
        name: "Georgia",
        code: "GE"
      },
      {
        name: "Germany",
        code: "DE"
      },
      {
        name: "Ghana",
        code: "GH"
      },
      {
        name: "Gibraltar",
        code: "GI"
      },
      {
        name: "Greece",
        code: "GR"
      },
      {
        name: "Greenland",
        code: "GL"
      },
      {
        name: "Grenada",
        code: "GD"
      },
      {
        name: "Guadeloupe",
        code: "GP"
      },
      {
        name: "Guam",
        code: "GU"
      },
      {
        name: "Guatemala",
        code: "GT"
      },
      {
        name: "Guernsey",
        code: "GG"
      },
      {
        name: "Guinea",
        code: "GN"
      },
      {
        name: "Guinea-Bissau",
        code: "GW"
      },
      {
        name: "Guyana",
        code: "GY"
      },
      {
        name: "Haiti",
        code: "HT"
      },
      {
        name: "Heard Island and Mcdonald Islands",
        code: "HM"
      },
      {
        name: "Holy See (Vatican City State)",
        code: "VA"
      },
      {
        name: "Honduras",
        code: "HN"
      },
      {
        name: "Hong Kong",
        code: "HK"
      },
      {
        name: "Hungary",
        code: "HU"
      },
      {
        name: "Iceland",
        code: "IS"
      },
      {
        name: "India",
        code: "IN"
      },
      {
        name: "Indonesia",
        code: "ID"
      },
      {
        name: "Iran, Islamic Republic Of",
        code: "IR"
      },
      {
        name: "Iraq",
        code: "IQ"
      },
      {
        name: "Ireland",
        code: "IE"
      },
      {
        name: "Isle of Man",
        code: "IM"
      },
      {
        name: "Israel",
        code: "IL"
      },
      {
        name: "Italy",
        code: "IT"
      },
      {
        name: "Jamaica",
        code: "JM"
      },
      {
        name: "Japan",
        code: "JP"
      },
      {
        name: "Jersey",
        code: "JE"
      },
      {
        name: "Jordan",
        code: "JO"
      },
      {
        name: "Kazakhstan",
        code: "KZ"
      },
      {
        name: "Kenya",
        code: "KE"
      },
      {
        name: "Kiribati",
        code: "KI"
      },
      {
        name: "Korea, Democratic People'S Republic of",
        code: "KP"
      },
      {
        name: "Korea, Republic of",
        code: "KR"
      },
      {
        name: "Kuwait",
        code: "KW"
      },
      {
        name: "Kyrgyzstan",
        code: "KG"
      },
      {
        name: "Lao People'S Democratic Republic",
        code: "LA"
      },
      {
        name: "Latvia",
        code: "LV"
      },
      {
        name: "Lebanon",
        code: "LB"
      },
      {
        name: "Lesotho",
        code: "LS"
      },
      {
        name: "Liberia",
        code: "LR"
      },
      {
        name: "Libyan Arab Jamahiriya",
        code: "LY"
      },
      {
        name: "Liechtenstein",
        code: "LI"
      },
      {
        name: "Lithuania",
        code: "LT"
      },
      {
        name: "Luxembourg",
        code: "LU"
      },
      {
        name: "Macao",
        code: "MO"
      },
      {
        name: "Macedonia, The Former Yugoslav Republic of",
        code: "MK"
      },
      {
        name: "Madagascar",
        code: "MG"
      },
      {
        name: "Malawi",
        code: "MW"
      },
      {
        name: "Malaysia",
        code: "MY"
      },
      {
        name: "Maldives",
        code: "MV"
      },
      {
        name: "Mali",
        code: "ML"
      },
      {
        name: "Malta",
        code: "MT"
      },
      {
        name: "Marshall Islands",
        code: "MH"
      },
      {
        name: "Martinique",
        code: "MQ"
      },
      {
        name: "Mauritania",
        code: "MR"
      },
      {
        name: "Mauritius",
        code: "MU"
      },
      {
        name: "Mayotte",
        code: "YT"
      },
      {
        name: "Mexico",
        code: "MX"
      },
      {
        name: "Micronesia, Federated States of",
        code: "FM"
      },
      {
        name: "Moldova, Republic of",
        code: "MD"
      },
      {
        name: "Monaco",
        code: "MC"
      },
      {
        name: "Mongolia",
        code: "MN"
      },
      {
        name: "Montserrat",
        code: "MS"
      },
      {
        name: "Morocco",
        code: "MA"
      },
      {
        name: "Mozambique",
        code: "MZ"
      },
      {
        name: "Myanmar",
        code: "MM"
      },
      {
        name: "Namibia",
        code: "NA"
      },
      {
        name: "Nauru",
        code: "NR"
      },
      {
        name: "Nepal",
        code: "NP"
      },
      {
        name: "Netherlands",
        code: "NL"
      },
      {
        name: "Netherlands Antilles",
        code: "AN"
      },
      {
        name: "New Caledonia",
        code: "NC"
      },
      {
        name: "New Zealand",
        code: "NZ"
      },
      {
        name: "Nicaragua",
        code: "NI"
      },
      {
        name: "Niger",
        code: "NE"
      },
      {
        name: "Nigeria",
        code: "NG"
      },
      {
        name: "Niue",
        code: "NU"
      },
      {
        name: "Norfolk Island",
        code: "NF"
      },
      {
        name: "Northern Mariana Islands",
        code: "MP"
      },
      {
        name: "Norway",
        code: "NO"
      },
      {
        name: "Oman",
        code: "OM"
      },
      {
        name: "Pakistan",
        code: "PK"
      },
      {
        name: "Palau",
        code: "PW"
      },
      {
        name: "Palestinian Territory, Occupied",
        code: "PS"
      },
      {
        name: "Panama",
        code: "PA"
      },
      {
        name: "Papua New Guinea",
        code: "PG"
      },
      {
        name: "Paraguay",
        code: "PY"
      },
      {
        name: "Peru",
        code: "PE"
      },
      {
        name: "Philippines",
        code: "PH"
      },
      {
        name: "Pitcairn",
        code: "PN"
      },
      {
        name: "Poland",
        code: "PL"
      },
      {
        name: "Portugal",
        code: "PT"
      },
      {
        name: "Puerto Rico",
        code: "PR"
      },
      {
        name: "Qatar",
        code: "QA"
      },
      {
        name: "Reunion",
        code: "RE"
      },
      {
        name: "Romania",
        code: "RO"
      },
      {
        name: "Russian Federation",
        code: "RU"
      },
      {
        name: "RWANDA",
        code: "RW"
      },
      {
        name: "Saint Helena",
        code: "SH"
      },
      {
        name: "Saint Kitts and Nevis",
        code: "KN"
      },
      {
        name: "Saint Lucia",
        code: "LC"
      },
      {
        name: "Saint Pierre and Miquelon",
        code: "PM"
      },
      {
        name: "Saint Vincent and the Grenadines",
        code: "VC"
      },
      {
        name: "Samoa",
        code: "WS"
      },
      {
        name: "San Marino",
        code: "SM"
      },
      {
        name: "Sao Tome and Principe",
        code: "ST"
      },
      {
        name: "Saudi Arabia",
        code: "SA"
      },
      {
        name: "Senegal",
        code: "SN"
      },
      {
        name: "Serbia and Montenegro",
        code: "CS"
      },
      {
        name: "Seychelles",
        code: "SC"
      },
      {
        name: "Sierra Leone",
        code: "SL"
      },
      {
        name: "Singapore",
        code: "SG"
      },
      {
        name: "Slovakia",
        code: "SK"
      },
      {
        name: "Slovenia",
        code: "SI"
      },
      {
        name: "Solomon Islands",
        code: "SB"
      },
      {
        name: "Somalia",
        code: "SO"
      },
      {
        name: "South Africa",
        code: "ZA"
      },
      {
        name: "South Georgia and the South Sandwich Islands",
        code: "GS"
      },
      {
        name: "Spain",
        code: "ES"
      },
      {
        name: "Sri Lanka",
        code: "LK"
      },
      {
        name: "Sudan",
        code: "SD"
      },
      {
        name: "Suriname",
        code: "SR"
      },
      {
        name: "Svalbard and Jan Mayen",
        code: "SJ"
      },
      {
        name: "Swaziland",
        code: "SZ"
      },
      {
        name: "Sweden",
        code: "SE"
      },
      {
        name: "Switzerland",
        code: "CH"
      },
      {
        name: "Syrian Arab Republic",
        code: "SY"
      },
      {
        name: "Taiwan, Province of China",
        code: "TW"
      },
      {
        name: "Tajikistan",
        code: "TJ"
      },
      {
        name: "Tanzania, United Republic of",
        code: "TZ"
      },
      {
        name: "Thailand",
        code: "TH"
      },
      {
        name: "Timor-Leste",
        code: "TL"
      },
      {
        name: "Togo",
        code: "TG"
      },
      {
        name: "Tokelau",
        code: "TK"
      },
      {
        name: "Tonga",
        code: "TO"
      },
      {
        name: "Trinidad and Tobago",
        code: "TT"
      },
      {
        name: "Tunisia",
        code: "TN"
      },
      {
        name: "Turkey",
        code: "TR"
      },
      {
        name: "Turkmenistan",
        code: "TM"
      },
      {
        name: "Turks and Caicos Islands",
        code: "TC"
      },
      {
        name: "Tuvalu",
        code: "TV"
      },
      {
        name: "Uganda",
        code: "UG"
      },
      {
        name: "Ukraine",
        code: "UA"
      },
      {
        name: "United Arab Emirates",
        code: "AE"
      },
      {
        name: "United Kingdom",
        code: "GB"
      },
      {
        name: "United States",
        code: "US"
      },
      {
        name: "United States Minor Outlying Islands",
        code: "UM"
      },
      {
        name: "Uruguay",
        code: "UY"
      },
      {
        name: "Uzbekistan",
        code: "UZ"
      },
      {
        name: "Vanuatu",
        code: "VU"
      },
      {
        name: "Venezuela",
        code: "VE"
      },
      {
        name: "Viet Nam",
        code: "VN"
      },
      {
        name: "Virgin Islands, British",
        code: "VG"
      },
      {
        name: "Virgin Islands, U.S.",
        code: "VI"
      },
      {
        name: "Wallis and Futuna",
        code: "WF"
      },
      {
        name: "Western Sahara",
        code: "EH"
      },
      {
        name: "Yemen",
        code: "YE"
      },
      {
        name: "Zambia",
        code: "ZM"
      },
      {
        name: "Zimbabwe",
        code: "ZW"
      }
    ];
    return country;
  },
};

const fakerData: Array<{
  users: Users[];
  photos: string[];
  images: string[];
  dates: string[];
  times: string[];
  formattedTimes: string[];
  totals: number[];
  trueFalse: boolean[];
  stocks: number[];
  products: Products[];
  categories: Categories[];
  news: News[];
  files: Files[];
  jobs: string[];
  notificationCount: number;
  foods: Foods[];
  country: Country[];
}> = [];
for (let i = 0; i < 20; i++) {
  fakerData[fakerData.length] = {
    users: fakers.fakeUsers(),
    photos: fakers.fakePhotos(),
    images: fakers.fakeImages(),
    dates: fakers.fakeDates(),
    times: fakers.fakeTimes(),
    formattedTimes: fakers.fakeFormattedTimes(),
    totals: fakers.fakeTotals(),
    trueFalse: fakers.fakeTrueFalse(),
    stocks: fakers.fakeStocks(),
    products: fakers.fakeProducts(),
    categories: fakers.fakeCategories(),
    news: fakers.fakeNews(),
    files: fakers.fakeFiles(),
    jobs: fakers.fakeJobs(),
    notificationCount: fakers.fakeNotificationCount(),
    foods: fakers.fakeFoods(),
    country: fakers.fakerCountry(),
  };
}

export default fakerData;
