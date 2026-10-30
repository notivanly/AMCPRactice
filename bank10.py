from common import *

# ================= AMC 10 : ALGEBRA =================
P(10,'alg',1,'Exponents & logs',
 r"What is the value of $\dfrac{2^{10}+2^{9}}{2^{8}}$?",
 '6',['3','4','8','12'], R(2**10+2**9, 2**8),
 "Factor the numerator.",
 r"Factor $2^9$ out of the numerator: $2^{10}+2^9=2^9(2+1)=3\cdot2^9$. Dividing by $2^8$ gives $3\cdot2=6$.")

P(10,'alg',2,'Systems of equations',
 r"The sum of two real numbers is $12$ and the sum of their squares is $80$. What is their product?",
 '32',['16','24','28','40'], R(144-80,2),
 r"Square the sum: $(x+y)^2=x^2+y^2+2xy$.",
 r"We have $(x+y)^2=x^2+y^2+2xy$, so $144=80+2xy$ and $xy=32$.")

P(10,'alg',2,'Functions',
 r"A linear function $f$ satisfies $f(2)=7$ and $f(5)=19$. What is $f(10)$?",
 '39',['29','34','37','41'], 4*10-1,
 "Find the slope first.",
 r"The slope is $\frac{19-7}{5-2}=4$, so $f(x)=4x+b$. From $f(2)=7$ we get $b=-1$. Then $f(10)=40-1=39$.")

P(10,'alg',3,'Absolute value',
 r"How many real numbers $x$ satisfy $|x-3|+|x+1|=6$?",
 '2',['1','3','4','6'], 2,
 "Split into cases at $x=-1$ and $x=3$.",
 r"For $-1\le x\le3$ the sum is always $4$, which is not $6$. For $x>3$: $2x-2=6$ gives $x=4$. For $x<-1$: $-2x+2=6$ gives $x=-2$. Both are valid, so there are $2$ solutions.")

P(10,'alg',3,'Quadratics & Vieta',
 r"Let $r$ and $s$ be the roots of $x^2-7x+5=0$. What is $r^2+s^2$?",
 '39',['19','29','34','49'], 49-2*5,
 r"Write $r^2+s^2$ using $r+s$ and $rs$.",
 r"By Vieta, $r+s=7$ and $rs=5$. Then $r^2+s^2=(r+s)^2-2rs=49-10=39$.")

P(10,'alg',2,'Sequences',
 r"The first term of an arithmetic sequence is $5$ and the $10$th term is $41$. What is the $20$th term?",
 '81',['69','85','89','93'], 5+19*4,
 "Find the common difference.",
 r"The common difference is $d=\frac{41-5}{9}=4$. The $20$th term is $5+19\cdot4=81$.")

P(10,'alg',3,'Series',
 r"An infinite geometric series has first term $12$ and sum $18$. What is its second term?",
 '4',['1','2','3','6'], 12*R(1,3),
 r"Use $S=\frac{a}{1-r}$ to find the common ratio.",
 r"From $\frac{12}{1-r}=18$ we get $1-r=\frac23$, so $r=\frac13$. The second term is $12\cdot\frac13=4$.")

P(10,'alg',3,'Ratios & rates',
 r"Pipe A can fill a pool in $6$ hours and pipe B can fill it in $4$ hours. A drain can empty the full pool in $12$ hours. If all three are open, how many hours does it take to fill the empty pool?",
 '3',['2','4','5','6'], 1/(R(1,6)+R(1,4)-R(1,12)),
 "Add the fill rates and subtract the drain rate.",
 r"In pools per hour the net rate is $\frac16+\frac14-\frac1{12}=\frac{2+3-1}{12}=\frac13$. So it takes $3$ hours.")

P(10,'alg',3,'Polynomials',
 r"When $x^3-4x^2+kx-6$ is divided by $x-2$, the remainder is $4$. What is $k$?",
 '9',['3','5','7','11'], 9,
 "Use the Remainder Theorem.",
 r"By the Remainder Theorem the remainder is the value at $x=2$: $8-16+2k-6=2k-14$. Setting $2k-14=4$ gives $k=9$.")

P(10,'alg',4,'Inequalities & optimization',
 r"Real numbers $x$ and $y$ satisfy $3x+4y=25$. What is the minimum possible value of $x^2+y^2$?",
 '25',['9','16','36','50'], 25,
 r"$x^2+y^2$ is the squared distance from the origin to the point $(x,y)$.",
 r"The quantity $x^2+y^2$ is the squared distance from the origin to a point on the line $3x+4y=25$. The distance from the origin to the line is $\frac{25}{\sqrt{3^2+4^2}}=5$, so the minimum is $5^2=25$. (Equivalently, by Cauchy–Schwarz, $(3^2+4^2)(x^2+y^2)\ge(3x+4y)^2=625$.)")

def _recip():
    return sum(1 for a in range(7,200) if (6*a)%(a-6)==0 and (6*a)//(a-6)>0)
P(10,'alg',4,'Diophantine equations',
 r"How many ordered pairs $(a,b)$ of positive integers satisfy $\dfrac1a+\dfrac1b=\dfrac16$?",
 '9',['4','6','8','12'], _recip(),
 r"Clear denominators and try to factor $(a-6)(b-6)$.",
 r"Clearing denominators gives $6b+6a=ab$, which rearranges to $(a-6)(b-6)=36$. Both $a$ and $b$ must exceed $6$, so $a-6$ and $b-6$ are positive divisors of $36$. Since $36$ has $9$ divisors, there are $9$ ordered pairs.")

# ================= AMC 10 : GEOMETRY =================
P(10,'geo',1,'Area & perimeter',
 r"A square and an equilateral triangle have equal perimeters. The side length of the triangle is $12$. What is the area of the square?",
 '81',['36','54','64','72'], 81,
 "Find the perimeter, then the square’s side.",
 r"The triangle’s perimeter is $36$, so the square has side $9$ and area $81$.")

def _heron(a,b,c):
    s=R(a+b+c,2); return sqrt(s*(s-a)*(s-b)*(s-c))
P(10,'geo',2,'Triangles',
 r"A triangle has side lengths $9$, $10$, and $17$. What is its area?",
 '36',['30','40','45','48'], _heron(9,10,17),
 "Use Heron’s formula.",
 r"The semiperimeter is $s=18$. By Heron’s formula the area is $\sqrt{18\cdot9\cdot8\cdot1}=\sqrt{1296}=36$.")

P(10,'geo',2,'Circles',
 r"In a circle with center $O$, chord $AB$ subtends a central angle $\angle AOB=100^\circ$. Point $C$ lies on the major arc $AB$. What is $\angle ACB$?",
 r'50^\circ',[r'40^\circ',r'80^\circ',r'100^\circ',r'130^\circ'], 50,
 "An inscribed angle is half of the central angle on the same arc.",
 r"An inscribed angle is half the central angle that subtends the same arc. Since $C$ is on the major arc, $\angle ACB=\frac12\cdot100^\circ=50^\circ$.")

P(10,'geo',2,'Similar triangles',
 r"In triangle $ABC$, point $D$ is on $\overline{AB}$ and point $E$ is on $\overline{AC}$ with $\overline{DE}\parallel\overline{BC}$. If $AD=4$, $DB=6$, and $DE=5$, what is $BC$?",
 r'\frac{25}{2}',['8','10','15','20'], R(25,2),
 r"Triangles $ADE$ and $ABC$ are similar.",
 r"Triangles $ADE$ and $ABC$ are similar with ratio $\frac{AD}{AB}=\frac{4}{10}=\frac25$. So $BC=DE\cdot\frac52=\frac{25}{2}$.")

P(10,'geo',3,'Coordinate geometry',
 r"What is the area of the triangle with vertices $(0,0)$, $(6,2)$, and $(2,6)$?",
 '16',['20','24','30','32'], R(abs(6*6-2*2),2),
 "Use the cross product, or the shoelace formula.",
 r"By the shoelace formula, the area is $\frac12|6\cdot6-2\cdot2|=\frac12\cdot32=16$.")

P(10,'geo',3,'Circles',
 r"Two circles with radii $3$ and $8$ are externally tangent. A common external tangent line touches the circles at points $P$ and $Q$. What is the length of $\overline{PQ}$?",
 r'4\sqrt{6}',[r'2\sqrt{6}','8','11',r'\sqrt{146}'], 4*sqrt(6),
 "Draw the radii to the tangent points and form a right triangle.",
 r"The centers are $3+8=11$ apart. Drawing the radii to $P$ and $Q$ and a segment from the smaller center parallel to $PQ$ makes a right triangle with hypotenuse $11$ and a leg $8-3=5$. So $PQ=\sqrt{11^2-5^2}=\sqrt{96}=4\sqrt6$.")

P(10,'geo',3,'Triangles',
 r"A triangle has side lengths $13$, $14$, and $15$. What is the radius of its inscribed circle?",
 '4',['3','5','6','7'], 4,
 r"Use area $=r\cdot s$.",
 r"The semiperimeter is $s=21$, and by Heron’s formula the area is $\sqrt{21\cdot8\cdot7\cdot6}=84$. Since area $=rs$, we get $r=\frac{84}{21}=4$.")

def _trap():
    h=sqrt(25**2-7**2); return R(10+24,2)*h
P(10,'geo',3,'Area & perimeter',
 r"An isosceles trapezoid has parallel sides of lengths $10$ and $24$ and legs of length $25$. What is its area?",
 '408',['204','340','384','416'], _trap(),
 "Drop perpendiculars from the shorter base to find the height.",
 r"Dropping perpendiculars from the ends of the shorter base cuts off two right triangles, each with base $\frac{24-10}{2}=7$ and hypotenuse $25$, so the height is $\sqrt{25^2-7^2}=24$. The area is $\frac{10+24}{2}\cdot24=408$.")

P(10,'geo',3,'Polygons',
 r"What is the area of a regular hexagon with side length $4$?",
 r'24\sqrt{3}',[r'8\sqrt{3}',r'12\sqrt{3}',r'16\sqrt{3}','36'], 6*sqrt(3)/4*16,
 "Split the hexagon into six equilateral triangles.",
 r"A regular hexagon splits into $6$ equilateral triangles of side $4$. Each has area $\frac{\sqrt3}{4}\cdot16=4\sqrt3$, so the total is $24\sqrt3$.")

P(10,'geo',5,'Circles',
 r"A circle is inscribed in a square of side length $12$. A smaller circle is placed in one corner of the square, tangent to the two sides at that corner and externally tangent to the large circle. What is the radius of the smaller circle?",
 r'18-12\sqrt{2}',[r'3-\sqrt{2}',r'6-3\sqrt{2}',r'6\sqrt{2}-6',r'12-6\sqrt{2}'], 18-12*sqrt(2),
 "Place the corner at the origin and write the distance between the two centers two ways.",
 r"Put the corner at the origin. The large circle has center $(6,6)$ and radius $6$; the small circle has center $(r,r)$ and radius $r$. The distance between centers is $\sqrt2(6-r)$, and tangency requires it to equal $6+r$. Solving, $r(1+\sqrt2)=6\sqrt2-6$, so $r=\frac{6(\sqrt2-1)}{\sqrt2+1}=6(\sqrt2-1)^2=18-12\sqrt2$.")

P(10,'geo',2,'Circles',
 r"Two chords of a circle intersect inside the circle. One chord is divided into segments of lengths $3$ and $8$, and the other chord is divided into segments of lengths $4$ and $x$. What is $x$?",
 '6',['2','4','5','12'], R(3*8,4),
 "Use the power of a point (intersecting chords theorem).",
 r"For intersecting chords, the products of the segments are equal: $3\cdot8=4\cdot x$, so $x=6$.")

P(10,'geo',2,'Solid geometry',
 r"A cone has base radius $3$ and slant height $5$. What is its volume?",
 r'12\pi',[r'9\pi',r'15\pi',r'20\pi',r'36\pi'], 12*pi,
 "Find the height with the Pythagorean theorem.",
 r"The height is $\sqrt{5^2-3^2}=4$. The volume is $\frac13\pi r^2h=\frac13\pi\cdot9\cdot4=12\pi$.")

# ================= AMC 10 : NUMBER THEORY =================
P(10,'nt',2,'Modular arithmetic',
 r"What is the remainder when $2^{100}$ is divided by $7$?",
 '2',['1','3','4','6'], pow(2,100,7),
 r"Find the cycle of powers of $2$ modulo $7$.",
 r"Modulo $7$, the powers of $2$ are $2,4,1,2,4,1,\ldots$ with period $3$. Since $100=3\cdot33+1$, $2^{100}\equiv2^1=2$.")

P(10,'nt',2,'Divisors',
 r"What is the sum of all the positive divisors of $60$?",
 '168',['120','144','156','180'], sum(divisors(60)),
 "Factor $60$ and use the divisor-sum formula.",
 r"Since $60=2^2\cdot3\cdot5$, the sum of divisors is $(1+2+4)(1+3)(1+5)=7\cdot4\cdot6=168$.")

P(10,'nt',2,'Divisors',
 r"For how many positive integers $n$ is $\dfrac{n+12}{n}$ an integer?",
 '6',['3','4','8','12'], len(divisors(12)),
 r"Rewrite $\frac{n+12}{n}$ as $1+\frac{12}{n}$.",
 r"We have $\frac{n+12}{n}=1+\frac{12}{n}$, which is an integer exactly when $n$ divides $12$. The divisors of $12$ are $1,2,3,4,6,12$, so there are $6$ values.")

P(10,'nt',4,'Primes',
 r"Let $N$ be the smallest positive integer such that $2N$ is a perfect square and $3N$ is a perfect cube. What is $N$?",
 '72',['18','36','48','54'], next(n for n in range(1,10000) if sp.integer_nthroot(2*n,2)[1] and sp.integer_nthroot(3*n,3)[1]),
 r"Write $N=2^a3^b$ and think about parities and multiples of $3$ in the exponents.",
 r"Write $N=2^a3^b$ (other primes would only make it larger). For $2N=2^{a+1}3^b$ to be a square, $a+1$ and $b$ must be even. For $3N=2^a3^{b+1}$ to be a cube, $a$ and $b+1$ must be multiples of $3$. The smallest choice is $a=3$ and $b=2$, so $N=2^3\cdot3^2=72$.")

P(10,'nt',3,'Modular arithmetic',
 r"What is the remainder when $3^{2024}$ is divided by $100$?",
 '81',['3','27','49','91'], pow(3,2024,100),
 r"Find the order of $3$ modulo $100$, or compute $3^{20}$ modulo $100$.",
 r"Compute $3^{10}=59049\equiv49$ and $3^{20}\equiv49^2=2401\equiv1\pmod{100}$. Since $2024=20\cdot101+4$, we get $3^{2024}\equiv3^4=81$.")

P(10,'nt',4,'Inclusion–exclusion',
 r"How many integers from $1$ to $200$, inclusive, are divisible by at least one of $2$, $3$, or $5$?",
 '146',['96','120','134','150'], sum(1 for n in range(1,201) if n%2==0 or n%3==0 or n%5==0),
 "Count the complement: integers with none of these prime factors.",
 r"Count the integers coprime to $30$ instead. In each block of $30$ there are $\varphi(30)=8$ of them, so $6$ blocks ($1$–$180$) give $48$. In $181$–$200$ the ones coprime to $30$ match $1$–$20$: $1,7,11,13,17,19$, which is $6$ more. That is $54$ integers, so $200-54=146$ have a factor of $2$, $3$, or $5$.")

P(10,'nt',3,'Diophantine equations',
 r"How many ordered pairs $(x,y)$ of positive integers satisfy $x^2-y^2=105$?",
 '4',['1','2','3','6'], sum(1 for x in range(1,200) for y in range(1,x) if x*x-y*y==105),
 r"Factor the left side as $(x-y)(x+y)$.",
 r"Write $(x-y)(x+y)=105$. Both factors are odd divisors of $105$ with $x-y<x+y$: $(1,105)$, $(3,35)$, $(5,21)$, $(7,15)$. Each gives integer $x$ and $y$ (for example $(7,15)$ gives $x=11$, $y=4$), so there are $4$ pairs.")

P(10,'nt',4,'Divisors',
 r"How many positive divisors of $2^{12}\cdot3^{8}\cdot5^{4}$ are perfect squares?",
 '105',['45','60','90','120'], 7*5*3,
 "A divisor is a square exactly when all its exponents are even.",
 r"A divisor $2^a3^b5^c$ is a perfect square exactly when $a,b,c$ are all even. There are $7$ choices for $a$ ($0,2,\ldots,12$), $5$ for $b$, and $3$ for $c$, for $7\cdot5\cdot3=105$.")

P(10,'nt',3,'Factorials',
 r"How many trailing zeros does $125!$ have?",
 '31',['24','25','30','33'], sum(125//5**k for k in range(1,4)),
 "Count the factors of $5$.",
 r"Each trailing zero comes from a factor of $10=2\cdot5$, and factors of $2$ are plentiful. The number of factors of $5$ in $125!$ is $\lfloor125/5\rfloor+\lfloor125/25\rfloor+\lfloor125/125\rfloor=25+5+1=31$.")

def _term():
    c=0
    for n in range(1,100):
        m=n
        while m%2==0: m//=2
        while m%5==0: m//=5
        if m==1: c+=1
    return c
P(10,'nt',4,'Primes',
 r"For how many positive integers $n<100$ is $\dfrac1n$ a terminating decimal?",
 '14',['10','12','15','16'], _term(),
 r"A fraction $\frac1n$ terminates exactly when $n=2^a5^b$.",
 r"The decimal for $\frac1n$ terminates exactly when $n$ has no prime factors other than $2$ and $5$. Below $100$ these are $1,2,4,8,16,32,64$ (powers of $2$), $5,10,20,40,80$, and $25,50$. That is $7+5+2=14$.")

# ================= AMC 10 : COUNTING & PROBABILITY =================
P(10,'cp',1,'Counting principle',
 r"How many three-digit positive integers have only odd digits?",
 '125',['60','90','100','150'], 5**3,
 "There are five odd digits.",
 r"Each of the three digits can be any of $1,3,5,7,9$, so there are $5\cdot5\cdot5=125$ such integers.")

P(10,'cp',2,'Combinations',
 r"A committee of $4$ people is chosen from $6$ men and $4$ women. How many committees include at least one woman?",
 '195',['120','150','180','210'], math.comb(10,4)-math.comb(6,4),
 "Use complementary counting.",
 r"There are $\binom{10}{4}=210$ committees in all. Those with no women number $\binom64=15$. So $210-15=195$ include at least one woman.")

P(10,'cp',2,'Probability',
 r"Two fair six-sided dice are rolled. What is the probability that the sum is a prime number?",
 r'\frac{5}{12}',[r'\frac{1}{4}',r'\frac{1}{3}',r'\frac{7}{18}',r'\frac{4}{9}'], R(15,36),
 "List the prime sums and count the ways to roll each.",
 r"The prime sums are $2,3,5,7,11$, which occur in $1,2,4,6,2$ ways respectively: $15$ ways out of $36$. The probability is $\frac{15}{36}=\frac5{12}$.")

P(10,'cp',3,'Stars & bars',
 r"How many ordered triples $(a,b,c)$ of nonnegative integers satisfy $a+b+c=10$?",
 '66',['36','45','55','60'], math.comb(12,2),
 "Use stars and bars.",
 r"By stars and bars, the number of solutions is $\binom{10+2}{2}=\binom{12}{2}=66$.")

P(10,'cp',3,'Permutations',
 r"Six people sit around a circular table, and two seatings are the same if one is a rotation of the other. In how many seatings are two particular people, Ana and Ben, not next to each other?",
 '72',['36','48','60','120'], math.factorial(5)-2*math.factorial(4),
 "Count all seatings, then subtract those where they are adjacent.",
 r"Without restrictions there are $(6-1)!=120$ circular seatings. If Ana and Ben sit together, treat them as a block: $(5-1)!\cdot2=48$ seatings. So $120-48=72$.")

P(10,'cp',2,'Probability',
 r"A fair coin is flipped $6$ times. What is the probability of getting exactly $3$ heads?",
 r'\frac{5}{16}',[r'\frac{1}{4}',r'\frac{3}{8}',r'\frac{15}{32}',r'\frac{1}{2}'], R(20,64),
 "Count the sequences with exactly three heads.",
 r"There are $2^6=64$ equally likely sequences, and $\binom63=20$ have exactly $3$ heads. The probability is $\frac{20}{64}=\frac5{16}$.")

def _catalan5():
    from functools import lru_cache
    @lru_cache(None)
    def f(x,y):
        if y>x: return 0
        if x==0 and y==0: return 1
        return (f(x-1,y) if x>0 else 0)+(f(x,y-1) if y>0 else 0)
    return f(5,5)
P(10,'cp',4,'Paths & grids',
 r"A path from $(0,0)$ to $(5,5)$ uses only unit steps right or up and never goes above the line $y=x$ (it may touch the line). How many such paths are there?",
 '42',['14','30','36','40'], _catalan5(),
 "These paths are counted by the Catalan numbers.",
 r"Paths that never rise above $y=x$ from $(0,0)$ to $(n,n)$ are counted by the Catalan number $C_n=\frac{1}{n+1}\binom{2n}{n}$. For $n=5$ this is $\frac16\binom{10}{5}=\frac{252}{6}=42$.")

P(10,'cp',3,'Probability',
 r"A fair six-sided die is rolled repeatedly. What is the probability that the first $6$ appears on exactly the third roll?",
 r'\frac{25}{216}',[r'\frac{1}{216}',r'\frac{5}{72}',r'\frac{1}{6}',r'\frac{125}{216}'], R(25,216),
 "The first two rolls must not be $6$.",
 r"We need a non-$6$ on rolls $1$ and $2$ and a $6$ on roll $3$: $\frac56\cdot\frac56\cdot\frac16=\frac{25}{216}$.")

P(10,'cp',4,'Inclusion–exclusion',
 r"In how many ways can five letters be placed into five addressed envelopes, one letter per envelope, so that no letter is in its own envelope?",
 '44',['9','24','36','60'], sp.subfactorial(5),
 "This is a derangement; use inclusion–exclusion.",
 r"By inclusion–exclusion the number of derangements of $5$ objects is $5!\left(1-\frac1{1!}+\frac1{2!}-\frac1{3!}+\frac1{4!}-\frac1{5!}\right)=120-120+60-20+5-1=44$.")

P(10,'cp',4,'Combinations',
 r"How many ways are there to choose three distinct numbers from $\{1,2,\ldots,20\}$ that, in increasing order, form an arithmetic progression?",
 '90',['45','60','75','85'], sum(1 for a in range(1,21) for c in range(a+2,21) if (a+c)%2==0),
 "The first and last numbers determine the middle one.",
 r"The first and third numbers determine the middle one, which must be their average, so they must have the same parity. Choose $2$ of the $10$ even numbers or $2$ of the $10$ odd numbers: $\binom{10}{2}+\binom{10}{2}=90$.")

P(10,'cp',4,'Expected value',
 r"A fair six-sided die is rolled twice. What is the expected value of the larger of the two numbers rolled?",
 r'\frac{161}{36}',[r'\frac{7}{2}','4',r'\frac{25}{6}',r'\frac{13}{3}'], R(161,36),
 r"Find $P(\max=k)$ for each $k$.",
 r"The maximum is at most $k$ with probability $\frac{k^2}{36}$, so $P(\max=k)=\frac{k^2-(k-1)^2}{36}=\frac{2k-1}{36}$. The expected value is $\frac1{36}\sum_{k=1}^6k(2k-1)=\frac{1+6+15+28+45+66}{36}=\frac{161}{36}$.")
