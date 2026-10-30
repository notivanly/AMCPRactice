from common import *

# ================= AMC 8 : ALGEBRA & NUMBER SENSE =================
P(8,'alg',1,'Linear equations',
 r"Mia buys $4$ notebooks that cost $\$3$ each and some pens that cost $\$2$ each. She pays $\$26$ in all. How many pens did she buy?",
 '7',['5','6','8','9'], 7,
 "Take the notebook cost off the total first.",
 r"The notebooks cost $4\cdot3=12$ dollars, so the pens cost $26-12=14$ dollars. At $\$2$ each, that is $14\div2=7$ pens.")

P(8,'alg',1,'Averages',
 r"The average of five numbers is $18$. Four of the numbers are $12$, $15$, $20$, and $21$. What is the fifth number?",
 '22',['18','20','21','24'], 5*18-(12+15+20+21),
 "Find the total of all five numbers first.",
 r"Five numbers with average $18$ have sum $5\cdot18=90$. The four known numbers add to $12+15+20+21=68$, so the fifth number is $90-68=22$.")

P(8,'alg',2,'Ratios & rates',
 r"A recipe uses $3$ cups of flour for every $2$ cups of sugar. A baker has $15$ cups of flour. How many cups of sugar are needed to keep the same ratio?",
 '10',['9','12','18','22.5'], 10,
 "Flour to sugar is $3:2$. How many groups of $3$ cups of flour are there?",
 r"The ratio of flour to sugar is $3:2$. Fifteen cups of flour is $5$ groups of $3$ cups, so the sugar is $5\cdot2=10$ cups.")

P(8,'alg',2,'Consecutive integers',
 r"The sum of three consecutive even integers is $78$. What is the largest of the three?",
 '28',['22','24','26','30'], 28,
 "The middle number is the average of the three.",
 r"The middle number is the average, $78\div3=26$. The integers are $24$, $26$, $28$, so the largest is $28$.")

P(8,'alg',3,'Ratios & rates',
 r"Alice can paint a fence in $6$ hours and Bob can paint the same fence in $3$ hours. Working together at their steady rates, how many hours will they need?",
 '2',['1.5','2.5','3','4.5'], 2,
 "Add their rates (fraction of the fence per hour).",
 r"Alice paints $\frac16$ of the fence per hour and Bob paints $\frac13$. Together that is $\frac16+\frac26=\frac12$ of the fence per hour, so they need $2$ hours.")

P(8,'alg',3,'Ratios & rates',
 r"Sam walks to school at $4$ miles per hour and walks home along the same route at $6$ miles per hour. What is his average speed, in miles per hour, for the whole round trip?",
 '4.8',['4.5','5','5.2','5.5'], R(24,5),
 "Average speed is total distance divided by total time, not the average of the two speeds.",
 r"Let the one-way distance be $12$ miles. Going takes $12/4=3$ hours and returning takes $12/6=2$ hours. The total is $24$ miles in $5$ hours, so the average speed is $24/5=4.8$ miles per hour.")

P(8,'alg',3,'Percents',
 r"The price of a jacket is reduced by $20\%$, and then the reduced price is reduced by another $25\%$. The final price is what percent of the original price?",
 r'60\%',[r'40\%',r'45\%',r'55\%',r'65\%'], R(80,100)*R(75,100)*100,
 "Each reduction multiplies the price by a factor.",
 r"The two reductions multiply the price by $0.80$ and then $0.75$. Since $0.80\cdot0.75=0.60$, the final price is $60\%$ of the original.")

def _seq():
    a = 3
    for _ in range(5): a = 2*a-1
    return a
P(8,'alg',3,'Sequences',
 r"A sequence begins $3, 5, 9, 17, \ldots$. Each term after the first is $1$ less than twice the previous term. What is the $6$th term?",
 '65',['33','49','63','97'], _seq(),
 "Apply the rule twice more.",
 r"Continue the rule: after $17$ comes $2\cdot17-1=33$, and then $2\cdot33-1=65$. The $6$th term is $65$.")

P(8,'alg',4,'Systems of equations',
 r"Two numbers have sum $20$ and product $91$. What is the positive difference between them?",
 '6',['4','8','9','13'], int(math.isqrt(400-4*91)),
 r"Try the identity $(a-b)^2=(a+b)^2-4ab$.",
 r"Since $(a-b)^2=(a+b)^2-4ab=400-364=36$, the positive difference is $6$. (The numbers are $7$ and $13$.)")

P(8,'alg',4,'Ratios & rates',
 r"At Maple School the ratio of boys to girls is $3:5$. After $6$ more boys join the school, the ratio of boys to girls is $4:5$. How many students are at the school after the boys join?",
 '54',['36','42','48','60'], 3*6+6+5*6,
 r"Write the boys and girls as $3k$ and $5k$.",
 r"Let the boys and girls be $3k$ and $5k$. After $6$ boys join, $\frac{3k+6}{5k}=\frac45$, so $15k+30=20k$ and $k=6$. Then there are $3\cdot6+6=24$ boys and $5\cdot6=30$ girls, which is $54$ students.")

# ================= AMC 8 : GEOMETRY =================
P(8,'geo',1,'Area & perimeter',
 r"A rectangle has perimeter $36$, and its length is twice its width. What is its area?",
 '72',['36','48','64','81'], 72,
 "Call the width $w$ and write the perimeter in terms of $w$.",
 r"If the width is $w$, the perimeter is $2(2w+w)=6w=36$, so $w=6$ and the length is $12$. The area is $6\cdot12=72$.")

P(8,'geo',1,'Angles',
 r"In triangle $ABC$, $\angle A=30^\circ$ and $\angle B$ is twice as large as $\angle C$. What is the measure of $\angle B$?",
 r'100^\circ',[r'50^\circ',r'75^\circ',r'90^\circ',r'120^\circ'], 100,
 "The angles of a triangle add to $180^\\circ$.",
 r"The angles of a triangle sum to $180^\circ$, so $\angle B+\angle C=150^\circ$. With $\angle B=2\angle C$ we get $3\angle C=150^\circ$, so $\angle C=50^\circ$ and $\angle B=100^\circ$.")

P(8,'geo',2,'Right triangles',
 r"A $13$-foot ladder leans against a vertical wall. The foot of the ladder is $5$ feet from the wall. How many feet up the wall does the ladder reach?",
 '12',['7','8','10','13'], 12,
 "Look for a famous Pythagorean triple.",
 r"The ladder, wall, and ground form a right triangle with hypotenuse $13$ and one leg $5$. The other leg is $\sqrt{13^2-5^2}=\sqrt{144}=12$.")

P(8,'geo',2,'Area & perimeter',
 r"A square has side length $10$. A $3\times3$ square is cut out of each of its four corners. What is the perimeter of the resulting figure?",
 '40',['28','46','52','64'], 40,
 "Compare the boundary you remove with the boundary you add.",
 r"Cutting a square out of a corner removes two segments of length $3$ from the boundary and adds two new segments of length $3$. The perimeter does not change, so it stays $4\cdot10=40$.")

P(8,'geo',2,'Solid geometry',
 r"A $3\times3\times3$ cube is painted on all of its outside faces and then cut into $27$ unit cubes. How many of the unit cubes have exactly two painted faces?",
 '12',['8','14','18','24'], 12,
 "Which unit cubes lie on an edge but not at a corner?",
 r"Cubes with exactly two painted faces sit along the edges of the big cube but not at the corners. The big cube has $12$ edges, and each edge has exactly one such middle cube, so there are $12$.")

P(8,'geo',3,'Circles',
 r"A circle has area $64\pi$. A square is inscribed in the circle. What is the area of the square?",
 '128',['32','64','96','256'], 128,
 "The diagonal of the square is a diameter of the circle.",
 r"The radius is $8$, so the diagonal of the square equals the diameter, $16$. A square with diagonal $d$ has area $\frac{d^2}{2}=\frac{256}{2}=128$.")

P(8,'geo',3,'Triangles',
 r"A triangle has side lengths $13$, $14$, and $15$ and area $84$. What is the length of the altitude to the side of length $14$?",
 '12',['7','9','11','13'], 2*84//14,
 r"Use area $=\frac12\cdot\text{base}\cdot\text{height}$.",
 r"Since area $=\frac12\cdot\text{base}\cdot\text{height}$, we have $84=\frac12\cdot14\cdot h$, so $h=12$.")

P(8,'geo',3,'Polygons',
 r"Each interior angle of a regular polygon measures $150^\circ$. How many sides does the polygon have?",
 '12',['10','14','15','18'], 360//30,
 "Exterior angles of any convex polygon sum to $360^\\circ$.",
 r"Each exterior angle is $180^\circ-150^\circ=30^\circ$. The exterior angles of a polygon sum to $360^\circ$, so there are $360/30=12$ sides.")

def _dmn():
    A,B,C,D,M,N=(0,0),(8,0),(8,6),(0,6),(4,0),(8,3)
    (x1,y1),(x2,y2),(x3,y3)=D,M,N
    return abs(x1*(y2-y3)+x2*(y3-y1)+x3*(y1-y2))/2
P(8,'geo',4,'Area & perimeter',
 r"Rectangle $ABCD$ has $AB=8$ and $BC=6$. Point $M$ is the midpoint of $\overline{AB}$ and point $N$ is the midpoint of $\overline{BC}$. What is the area of triangle $DMN$?",
 '18',['9','12','15','16'], _dmn(),
 "Subtract the three corner triangles from the rectangle.",
 r"The rectangle has area $8\cdot6=48$. Remove the three right triangles around $\triangle DMN$: $\triangle ADM$ has area $\frac12\cdot4\cdot6=12$, $\triangle MBN$ has area $\frac12\cdot4\cdot3=6$, and $\triangle NCD$ has area $\frac12\cdot3\cdot8=12$. So $[DMN]=48-12-6-12=18$.")

P(8,'geo',3,'Circles',
 r"A circle is inscribed in a right triangle with legs $6$ and $8$. What is the radius of the circle?",
 '2',['1','1.5','3','4'], 2,
 "For a right triangle, $r=\\frac{a+b-c}{2}$.",
 r"The hypotenuse is $10$. For a right triangle, $r=\frac{a+b-c}{2}=\frac{6+8-10}{2}=2$. (Check: area $24=r\cdot s=r\cdot12$, so $r=2$.)")

P(8,'geo',4,'Polygons',
 r"An equilateral triangle and a regular hexagon have equal perimeters. What is the ratio of the area of the triangle to the area of the hexagon?",
 r'\frac{2}{3}',[r'\frac{1}{2}',r'\frac{3}{4}','1',r'\frac{3}{2}'], R(2,3),
 "A regular hexagon is made of six equilateral triangles.",
 r"Let the hexagon have side $s$. Its perimeter is $6s$, so the triangle has side $2s$. The hexagon is $6$ equilateral triangles of side $s$, with area $6\cdot\frac{\sqrt3}{4}s^2$, while the big triangle has area $\frac{\sqrt3}{4}(2s)^2=4\cdot\frac{\sqrt3}{4}s^2$. The ratio is $\frac46=\frac23$.")

P(8,'geo',5,'Circles',
 r"Four circles of radius $1$ are placed so that each is tangent to two others, with their centers at the corners of a square. A smaller circle is placed in the gap in the middle, tangent to all four circles. What is its radius?",
 r'\sqrt{2}-1',[r'\frac{1}{3}',r'\frac{1}{2}',r'2-\sqrt{2}',r'\frac{\sqrt{2}}{2}'], sqrt(2)-1,
 "The four centers form a square of side $2$.",
 r"The centers of the four unit circles form a square of side $2$, whose diagonal is $2\sqrt2$. The small circle is centered at the middle of that square, which is $\sqrt2$ from each corner. Tangency means $\sqrt2=1+r$, so $r=\sqrt2-1$.")

# ================= AMC 8 : NUMBER THEORY =================
P(8,'nt',1,'Multiples & divisibility',
 r"How many positive multiples of $7$ are less than $100$?",
 '14',['10','12','13','15'], 99//7,
 "Divide $99$ by $7$ and round down.",
 r"The multiples are $7\cdot1,7\cdot2,\ldots$ and $7\cdot14=98<100<105=7\cdot15$. There are $14$ of them.")

P(8,'nt',2,'Primes',
 r"What is the sum of all the prime numbers between $20$ and $40$?",
 '120',['97','111','123','150'], sum(p for p in range(21,40) if sp.isprime(p)),
 "List the primes between $20$ and $40$ carefully.",
 r"The primes between $20$ and $40$ are $23$, $29$, $31$, and $37$. Their sum is $23+29+31+37=120$.")

P(8,'nt',2,'GCD & LCM',
 r"Two bells ring every $12$ minutes and every $15$ minutes, respectively. They ring together at 9:00 AM. After how many minutes will they next ring together?",
 '60',['3','27','30','180'], math.lcm(12,15),
 "You need the least common multiple.",
 r"They ring together again after $\operatorname{lcm}(12,15)$ minutes. Since $12=2^2\cdot3$ and $15=3\cdot5$, the lcm is $2^2\cdot3\cdot5=60$.")

P(8,'nt',3,'Modular arithmetic',
 r"What is the units digit of $7^{2024}$?",
 '1',['3','5','7','9'], pow(7,2024,10),
 "The units digits of powers of $7$ repeat in a cycle.",
 r"The units digits of $7^1,7^2,7^3,7^4,\ldots$ are $7,9,3,1,7,9,3,1,\ldots$, a cycle of length $4$. Since $2024$ is a multiple of $4$, the units digit of $7^{2024}$ is $1$.")

P(8,'nt',3,'GCD & LCM',
 r"What is the smallest positive integer that is divisible by each of $1,2,3,4,5,6,7,8$?",
 '840',['168','280','420','1680'], math.lcm(*range(1,9)),
 "Use the highest power of each prime that appears.",
 r"Take the highest power of each prime that divides any of the numbers: $2^3$ (from $8$), $3$, $5$, and $7$. The answer is $8\cdot3\cdot5\cdot7=840$.")

P(8,'nt',3,'Divisors',
 r"How many positive divisors does $360$ have?",
 '24',['16','18','20','30'], len(divisors(360)),
 "Factor $360$ into primes first.",
 r"Since $360=2^3\cdot3^2\cdot5$, the number of divisors is $(3+1)(2+1)(1+1)=24$.")

P(8,'nt',3,'Digits',
 r"How many two-digit positive integers are equal to $4$ times the sum of their digits?",
 '4',['1','2','3','5'], sum(1 for n in range(10,100) if n==4*(n//10+n%10)),
 r"Write the number as $10a+b$.",
 r"Write the number as $10a+b$. Then $10a+b=4(a+b)$ gives $6a=3b$, so $b=2a$. Since $b\le9$, $a$ can be $1,2,3,4$, giving $12$, $24$, $36$, $48$. That is $4$ numbers.")

P(8,'nt',4,'Digits',
 r"What is the sum of all the digits used when writing the integers from $1$ through $99$?",
 '900',['450','810','891','990'], sum(int(c) for n in range(1,100) for c in str(n)),
 "Count how often each digit appears in the units place and in the tens place.",
 r"Think of $0$ through $99$ as two-digit strings $00$ to $99$. The units digit takes each value $0$ through $9$ ten times, contributing $10\cdot45=450$, and the tens digit does the same, contributing another $450$. The total is $900$ (leading zeros add nothing).")

def _div4():
    return sum(1 for p in itertools.permutations('12345') if int(''.join(p))%4==0)
P(8,'nt',4,'Multiples & divisibility',
 r"Using each of the digits $1,2,3,4,5$ exactly once, how many five-digit numbers are divisible by $4$?",
 '24',['6','12','18','30'], _div4(),
 "Only the last two digits matter for divisibility by $4$.",
 r"A number is divisible by $4$ exactly when its last two digits form a multiple of $4$. Using two different digits from $1$ to $5$, the possible endings are $12$, $24$, $32$, and $52$. For each ending, the other three digits can be arranged in $3!=6$ ways, so there are $4\cdot6=24$ numbers.")

def _min12():
    n=1
    while len(divisors(n))!=12: n+=1
    return n
P(8,'nt',4,'Divisors',
 r"What is the smallest positive integer with exactly $12$ positive divisors?",
 '60',['48','72','84','96'], _min12(),
 r"A number $2^a3^b5^c\cdots$ has $(a+1)(b+1)(c+1)\cdots$ divisors.",
 r"A number $2^a3^b5^c\cdots$ has $(a+1)(b+1)(c+1)\cdots$ divisors. Ways to write $12$ as a product: $12$, $6\cdot2$, $4\cdot3$, $3\cdot2\cdot2$. The smallest numbers for these patterns are $2^{11}=2048$, $2^5\cdot3=96$, $2^3\cdot3^2=72$, and $2^2\cdot3\cdot5=60$. The smallest is $60$.")

P(8,'nt',4,'Digits',
 r"A three-digit palindrome reads the same forward and backward (for example, $484$). How many three-digit palindromes are divisible by $11$?",
 '8',['4','6','9','10'], sum(1 for a in range(1,10) for b in range(10) if (100*a+10*b+a)%11==0),
 r"Write the palindrome as $101a+10b$ and reduce mod $11$.",
 r"The palindrome $\overline{aba}=101a+10b$. Since $101\equiv2$ and $10\equiv-1 \pmod{11}$, it is divisible by $11$ exactly when $2a-b$ is a multiple of $11$. Either $b=2a$, giving $a=1,2,3,4$, or $b=2a-11$, giving $a=6,7,8,9$. The palindromes are $121,242,363,484,616,737,858,979$, so there are $8$.")

# ================= AMC 8 : COUNTING & PROBABILITY =================
P(8,'cp',1,'Counting principle',
 r"A student has $3$ shirts, $4$ pairs of pants, and $2$ hats. How many different outfits, each with one shirt, one pair of pants, and one hat, are possible?",
 '24',['9','12','14','18'], 3*4*2,
 "Multiply the number of independent choices.",
 r"The choices are independent, so the number of outfits is $3\cdot4\cdot2=24$.")

P(8,'cp',1,'Probability',
 r"A fair coin is flipped $3$ times. What is the probability of getting exactly two heads?",
 r'\frac{3}{8}',[r'\frac{1}{8}',r'\frac{1}{4}',r'\frac{1}{2}',r'\frac{5}{8}'], R(3,8),
 "List the outcomes with two heads.",
 r"There are $2^3=8$ equally likely outcomes. Exactly two heads occurs in $\binom32=3$ of them (HHT, HTH, THH), so the probability is $\frac38$.")

P(8,'cp',2,'Permutations',
 r"Five people sit in a row of five chairs. Two of them, Ana and Ben, insist on sitting next to each other. In how many ways can the five people be seated?",
 '48',['24','60','72','120'], 2*math.factorial(4),
 "Treat Ana and Ben as a single block.",
 r"Treat Ana and Ben as one block. Arranging $4$ objects takes $4!=24$ ways, and the two people can be ordered within the block in $2$ ways. The total is $24\cdot2=48$.")

P(8,'cp',2,'Combinations',
 r"At a party, each of $8$ people shakes hands exactly once with every other person. How many handshakes take place?",
 '28',['14','16','24','56'], math.comb(8,2),
 "Each handshake is a choice of $2$ people.",
 r"Each handshake is determined by choosing $2$ of the $8$ people, so there are $\binom82=28$ handshakes.")

P(8,'cp',3,'Probability',
 r"Two fair six-sided dice are rolled. What is the probability that the product of the two numbers is even?",
 r'\frac{3}{4}',[r'\frac{1}{4}',r'\frac{1}{2}',r'\frac{2}{3}',r'\frac{5}{6}'], R(3,4),
 "Count the complement: when is the product odd?",
 r"The product is odd only when both dice show odd numbers, which has probability $\frac12\cdot\frac12=\frac14$. So the product is even with probability $1-\frac14=\frac34$.")

P(8,'cp',3,'Permutations',
 r"How many distinct arrangements are there of the letters in the word BANANA?",
 '60',['20','30','120','360'], math.factorial(6)//(math.factorial(3)*math.factorial(2)),
 "Repeated letters make some orderings identical.",
 r"With $6$ letters there are $6!=720$ orderings, but the three A’s are interchangeable and so are the two N’s. Dividing out, $\frac{720}{3!\cdot2!}=60$.")

P(8,'cp',4,'Probability',
 r"A bag contains $4$ red and $6$ blue marbles. Two marbles are drawn at random without replacement. What is the probability that both marbles are the same color?",
 r'\frac{7}{15}',[r'\frac{1}{5}',r'\frac{1}{3}',r'\frac{2}{5}',r'\frac{1}{2}'], R(math.comb(4,2)+math.comb(6,2), math.comb(10,2)),
 "Count pairs of marbles rather than ordered draws.",
 r"There are $\binom{10}{2}=45$ equally likely pairs. Two red: $\binom42=6$ pairs. Two blue: $\binom62=15$ pairs. The probability is $\frac{6+15}{45}=\frac{21}{45}=\frac{7}{15}$.")

P(8,'cp',4,'Stars & bars',
 r"How many three-digit positive integers have digits that add up to $9$?",
 '45',['30','36','40','50','55'][0:1]+['36','40','55'], sum(1 for n in range(100,1000) if sum(map(int,str(n)))==9),
 r"Subtract $1$ from the hundreds digit, then count solutions to $a'+b+c=8$.",
 r"Let the digits be $a,b,c$ with $a\ge1$ and set $a'=a-1\ge0$. Then $a'+b+c=8$ in nonnegative integers, which by stars and bars has $\binom{10}{2}=45$ solutions. No digit can exceed $8$, so all are valid.")

P(8,'cp',4,'Recursion & tilings',
 r"In how many ways can a $2\times5$ rectangle be tiled with $1\times2$ dominoes, if each domino may be placed horizontally or vertically and no tiles overlap or overhang?",
 '8',['5','10','13','16'], 8,
 "Look at how the leftmost column can be covered.",
 r"Let $T_n$ be the number of tilings of a $2\times n$ rectangle. Either a vertical domino covers the leftmost column (leaving $T_{n-1}$) or two horizontal dominoes cover the first two columns (leaving $T_{n-2}$). So $T_n=T_{n-1}+T_{n-2}$ with $T_1=1$ and $T_2=2$, giving $1,2,3,5,8$. Thus $T_5=8$.")

def _paths():
    from functools import lru_cache
    @lru_cache(None)
    def f(x,y):
        if (x,y)==(2,2): return 0
        if x==0 and y==0: return 1
        return (f(x-1,y) if x>0 else 0)+(f(x,y-1) if y>0 else 0)
    return f(4,4)
P(8,'cp',5,'Paths & grids',
 r"A robot moves from $(0,0)$ to $(4,4)$ on a grid, moving one unit right or one unit up at each step. It must avoid the point $(2,2)$. How many different paths are possible?",
 '34',['28','36','40','44'], _paths(),
 "Count all paths, then subtract the ones that pass through $(2,2)$.",
 r"All paths from $(0,0)$ to $(4,4)$: $\binom84=70$. Paths through $(2,2)$: $\binom42\cdot\binom42=6\cdot6=36$. So $70-36=34$ paths avoid $(2,2)$.")

def _syt():
    c=0
    for top in itertools.combinations(range(1,7),3):
        bot=[x for x in range(1,7) if x not in top]
        if all(top[i]<bot[i] for i in range(3)): c+=1
    return c
P(8,'cp',5,'Counting principle',
 r"The numbers $1$ through $6$ are placed in the cells of a $2\times3$ grid, one number per cell, so that the numbers increase from left to right in each row and from top to bottom in each column. In how many ways can this be done?",
 '5',['3','4','6','8'], _syt(),
 r"The number $1$ must be in the top-left cell. Try listing the possible top rows.",
 r"The number $1$ must be in the top-left corner and $6$ in the bottom-right. Now list the possible top rows (increasing triples starting with $1$) whose bottom row is larger column by column: $123$, $124$, $125$, $134$, $135$. Each of these works and no other does, so there are $5$ ways.")
