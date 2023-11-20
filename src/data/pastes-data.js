module.exports = [
    {
      id: 1,
      user_id: 1,
      name: "Hello",
      syntax: "None",
      expiration: 10,
      exposure: "private",
      text: "Hello World!"
    },
    {
      id: 2,
      user_id: 1,
      name: "Hello World in Python",
      syntax: "Python",
      expiration: 24,
      exposure: "public",
      text: "print(Hello World!)"
    },
    {
      id: 3,
      user_id: 2,
      name: "String Reverse in JavaScript",
      syntax: "Javascript",
      expiration: 24,
      exposure: "public",
      text: "const stringReverse = str => str.split('').reverse().join('');"
    },
    {
      id: 4,
      user_id: 3,
      name: "Print file sizes in Perl",
      syntax: "Perl",
      expiration: 24,
      exposure: "public",
      text: "ls -lAF | perl -e ’while (<>) { next if /^[dt]/; print +(split)[4], '\n' } ’"
    }
  ];