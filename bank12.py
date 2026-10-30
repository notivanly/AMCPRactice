from common import *

# ================= AMC 12 : ALGEBRA, FUNCTIONS, COMPLEX =================
P(12,'alg',1,'Exponents & logs',
 r"What is the value of $\log_2 8+\log_3 81$?",
 '7',['3','5','6','12'], 3+4,
 r"Ask: $2$ to what power is $8$? $3$ to what power is $81$?",
 r"Since $2^3=8$ and $3^4=81$, the sum is $3+4=7$.")

P(12,'alg',1,'Complex numbers',
 r"What is $|3+4i|\cdot|5-12i|$?",
 '65',['17','25','169','195'], 5*13,
 "Compute each modulus with the Pythagorean theorem.",
 r"$|3+4i|=\sqrt{9+16}=5$ and $|5-12i|=\sqrt{25+144}=13$. The product is $65$.")

P(12,'alg',2,'Functions',
 r"Let $f(x)=\dfrac{2x+1}{x-3}$. What is $f(f(4))$?",
 r'\frac{19}{6}',[r'\frac{17}{6}',r'\frac{7}{2}',r'\frac{19}{3}','9'], R(19,6),
 "Work from the inside out.",
 r"First, $f(4)=\frac{9}{1}=9$. Then $f(9)=\frac{19}{6}$.")

P(12,'alg',3,'Series',
 r"What is the value of $\displaystyle\sum_{n=1}^{\infty}\frac{n}{2^n}$?",
 '2',[r'\frac{1}{2}','1',r'\frac{3}{2}','3'], sp.summation(sp.Symbol('n',integer=True,positive=True)/2**sp.Symbol('n',integer=True,positive=True),(sp.Symbol('n',integer=True,positive=True),1,sp.oo)),
 "Call the sum $S$ and compare $S$ with $\\frac12S$.",
 r"Let $S=\frac12+\frac24+\frac38+\cdots$. Then $\frac12S=\frac14+\frac28+\cdots$, and subtracting gives $\frac12S=\frac12+\frac14+\frac18+\cdots=1$. So $S=2$.")

P(12,'alg',3,'Exponents & logs',
 r"What is the sum of all real numbers $x$ satisfying $\log_2 x+\log_2(x-6)=4$?",
 '8',['2','4','6','10'], 8,
 r"Combine the logs, then check which roots lie in the domain.",
 r"Combining, $\log_2[x(x-6)]=4$, so $x^2-6x=16$ and $x^2-6x-16=0$, which factors as $(x-8)(x+2)=0$. The log requires $x>6$, so $x=-2$ is extraneous. The only solution is $x=8$.")

P(12,'alg',1,'Polynomials',
 r"The monic cubic polynomial $P(x)$ has roots $1$, $2$, and $3$. What is $P(0)$?",
 '-6',['-11','-1','6','11'], -6,
 "Write $P$ in factored form.",
 r"Since $P$ is monic with those roots, $P(x)=(x-1)(x-2)(x-3)$. Then $P(0)=(-1)(-2)(-3)=-6$.")

P(12,'alg',2,'Inequalities & optimization',
 r"Positive real numbers $x$ and $y$ satisfy $x+2y=12$. What is the maximum possible value of $xy$?",
 '18',['9','12','16','24'], 18,
 "Apply AM–GM to $x$ and $2y$.",
 r"Write $xy=\frac12\cdot x\cdot2y$. By AM–GM, $x\cdot2y\le\left(\frac{x+2y}{2}\right)^2=36$, with equality at $x=2y=6$. So $xy\le18$, and the maximum is $18$.")

P(12,'alg',3,'Complex numbers',
 r"What is the value of $(1+i)^{20}$?",
 '-1024',['-512','0','512','1024'], sp.expand((1+sp.I)**20),
 r"Compute $(1+i)^2$ first.",
 r"Since $(1+i)^2=2i$, we have $(1+i)^{20}=(2i)^{10}=2^{10}\cdot i^{10}=1024\cdot(-1)=-1024$.")

def _jac():
    a,b=1,3
    for _ in range(9): a,b=b,b+2*a
    return a
P(12,'alg',3,'Sequences',
 r"A sequence satisfies $a_1=1$, $a_2=3$, and $a_{n+2}=a_{n+1}+2a_n$ for all $n\ge1$. What is $a_{10}$?",
 '683',['171','341','512','1024'], _jac(),
 "Compute the first several terms and look for a pattern.",
 r"The terms are $1,3,5,11,21,43,85,171,341,683$. (Each term is twice the previous one, alternately plus and minus $1$; in closed form $a_n=\frac{2^{n+1}+(-1)^n}{3}$.) So $a_{10}=683$.")

P(12,'alg',2,'Inequalities & optimization',
 r"For how many integers $n$ is $(n^2-4)(n^2-25)<0$?",
 '4',['3','5','6','8'], sum(1 for n in range(-20,21) if (n*n-4)*(n*n-25)<0),
 r"The product is negative exactly when $4<n^2<25$.",
 r"The product of two numbers is negative when one is positive and one is negative, so $4<n^2<25$. The integers with this property satisfy $|n|\in\{3,4\}$, giving $n=\pm3,\pm4$: $4$ integers.")

def _p3():
    x=sp.Symbol('x'); rts=sp.Poly(x**3-4*x**2+5*x-7).nroots(n=30)
    return sum(r**3 for r in rts).as_real_imag()[0]
P(12,'alg',4,'Quadratics & Vieta',
 r"Let $a$, $b$, and $c$ be the roots of $x^3-4x^2+5x-7=0$. What is $a^3+b^3+c^3$?",
 '25',['4','11','18','32'], _p3(),
 r"Use $a^3+b^3+c^3=e_1^3-3e_1e_2+3e_3$.",
 r"By Vieta, $e_1=a+b+c=4$, $e_2=ab+bc+ca=5$, and $e_3=abc=7$. The identity $a^3+b^3+c^3=e_1^3-3e_1e_2+3e_3$ gives $64-60+21=25$.")

P(12,'alg',3,'Systems of equations',
 r"How many ordered pairs of real numbers $(x,y)$ satisfy $x^2+y^2=25$ and $xy=12$?",
 '4',['0','1','2','8'], 4,
 r"Look at $(x+y)^2$ and $(x-y)^2$.",
 r"We have $(x+y)^2=25+24=49$ and $(x-y)^2=25-24=1$. So $x+y=\pm7$ and $x-y=\pm1$, giving $4$ combinations, each with a unique $(x,y)$: $(4,3)$, $(3,4)$, $(-3,-4)$, $(-4,-3)$.")

P(12,'alg',3,'Diophantine equations',
 r"For how many integers $k$ does $x^2-kx+36=0$ have two integer roots (counting a repeated root)?",
 '10',['5','8','9','12'], len({a+36//a for a in range(1,37) if 36%a==0}|{-(a+36//a) for a in range(1,37) if 36%a==0}),
 "The roots multiply to $36$ and add to $k$.",
 r"If the roots are integers $r,s$ then $rs=36$ and $k=r+s$. The positive factorizations give sums $37,20,15,13,12$ (from $1\cdot36,2\cdot18,3\cdot12,4\cdot9,6\cdot6$), and the negative ones give $-37,-20,-15,-13,-12$. That is $10$ distinct values of $k$.")

# ================= AMC 12 : GEOMETRY & TRIGONOMETRY =================
P(12,'geo',1,'Trigonometry',
 r"In triangle $ABC$, $AB=6$, $AC=8$, and $\angle A=30^\circ$. What is the area of the triangle?",
 '12',['6','16','24',r'12\sqrt{3}'], R(1,2)*6*8*R(1,2),
 r"Use area $=\frac12ab\sin C$.",
 r"The area is $\frac12\cdot6\cdot8\cdot\sin30^\circ=\frac12\cdot48\cdot\frac12=12$.")

P(12,'geo',2,'Trigonometry',
 r"A triangle has side lengths $7$, $8$, and $13$. What is the measure of its largest angle?",
 r'120^\circ',[r'60^\circ',r'75^\circ',r'90^\circ',r'100^\circ'], 120,
 "The largest angle is opposite the longest side. Use the Law of Cosines.",
 r"The largest angle $\theta$ is opposite the side $13$. By the Law of Cosines, $\cos\theta=\frac{7^2+8^2-13^2}{2\cdot7\cdot8}=\frac{-56}{112}=-\frac12$, so $\theta=120^\circ$.")

P(12,'geo',2,'Trigonometry',
 r"Triangle $ABC$ has $AB=7$, $AC=9$, and $\angle A=60^\circ$. What is $BC$?",
 r'\sqrt{67}',[r'\sqrt{63}','8',r'\sqrt{130}',r'\sqrt{193}'], sqrt(67),
 "Use the Law of Cosines.",
 r"By the Law of Cosines, $BC^2=7^2+9^2-2\cdot7\cdot9\cos60^\circ=49+81-63=67$, so $BC=\sqrt{67}$.")

P(12,'geo',2,'Trigonometry',
 r"If $\sin\theta+\cos\theta=\dfrac12$, what is $\sin2\theta$?",
 r'-\frac{3}{4}',[r'-\frac{1}{2}',r'-\frac{1}{4}',r'\frac{1}{4}',r'\frac{3}{4}'], R(-3,4),
 r"Square both sides of the given equation.",
 r"Squaring gives $\sin^2\theta+2\sin\theta\cos\theta+\cos^2\theta=\frac14$, so $1+\sin2\theta=\frac14$ and $\sin2\theta=-\frac34$.")

P(12,'geo',2,'Coordinate geometry',
 r"What is the area of the region enclosed by the graph of $x^2+y^2-6x+4y=12$?",
 r'25\pi',[r'5\pi',r'12\pi',r'16\pi',r'50\pi'], 25*pi,
 "Complete the square in both variables.",
 r"Completing the square: $(x-3)^2+(y+2)^2=12+9+4=25$. This is a circle of radius $5$, with area $25\pi$.")

P(12,'geo',3,'Triangles',
 r"What is the radius of the circle passing through the three vertices of a triangle with side lengths $13$, $14$, and $15$?",
 r'\frac{65}{8}',[r'\frac{13}{2}','7',r'\frac{15}{2}',r'\frac{17}{2}'], R(65,8),
 r"Use $R=\frac{abc}{4K}$.",
 r"The area is $K=84$. The circumradius is $R=\frac{abc}{4K}=\frac{13\cdot14\cdot15}{4\cdot84}=\frac{2730}{336}=\frac{65}{8}$.")

P(12,'geo',5,'Circles',
 r"Two circles with radii $4$ and $9$ are externally tangent to each other, and both are tangent to the same line $\ell$ and lie on the same side of it. A third circle is tangent to both circles and to $\ell$, and lies between them. What is its radius?",
 r'\frac{36}{25}',[r'\frac{6}{5}',r'\frac{5}{3}','2',r'\frac{36}{13}'], R(36,25),
 r"Along the line, a circle of radius $r$ tangent to a circle of radius $\rho$ and to the line has tangent points $2\sqrt{r\rho}$ apart.",
 r"Two circles of radii $r$ and $\rho$ that are tangent to each other and to a line touch the line $2\sqrt{r\rho}$ apart. So the big circles touch the line $2\sqrt{36}=12$ apart. The third circle (radius $x$) touches the line $2\sqrt{4x}=4\sqrt x$ from the first and $2\sqrt{9x}=6\sqrt x$ from the second. Then $4\sqrt x+6\sqrt x=12$, so $\sqrt x=\frac65$ and $x=\frac{36}{25}$.")

P(12,'geo',3,'Solid geometry',
 r"A right circular cylinder of height $6$ is inscribed in a sphere of radius $5$ (the circular edges of both bases lie on the sphere). What is the volume of the cylinder?",
 r'96\pi',[r'24\pi',r'48\pi',r'72\pi',r'150\pi'], 96*pi,
 "Find the cylinder’s radius with the Pythagorean theorem.",
 r"A radius of the cylinder’s base, half the cylinder’s height, and the sphere’s radius form a right triangle: $r^2+3^2=5^2$, so $r=4$. The volume is $\pi\cdot4^2\cdot6=96\pi$.")

P(12,'geo',3,'Triangles',
 r"In triangle $ABC$, $AB=AC=5$ and $BC=6$. Let $D$ be the foot of the perpendicular from $B$ to $\overline{AC}$. What is $BD$?",
 r'\frac{24}{5}',[r'\frac{18}{5}','4',r'\frac{9}{2}','5'], R(24,5),
 "Compute the area in two ways.",
 r"The altitude from $A$ to $BC$ is $\sqrt{25-9}=4$, so the area is $\frac12\cdot6\cdot4=12$. Also the area is $\frac12\cdot AC\cdot BD=\frac52BD$. So $BD=\frac{24}{5}$.")

P(12,'geo',2,'Trigonometry',
 r"If $\tan\theta=3$, what is $\sin2\theta$?",
 r'\frac{3}{5}',[r'\frac{3}{10}',r'\frac{3}{4}',r'\frac{4}{5}',r'\frac{9}{10}'], R(3,5),
 r"Use $\sin2\theta=\frac{2\tan\theta}{1+\tan^2\theta}$.",
 r"$\sin2\theta=\frac{2\tan\theta}{1+\tan^2\theta}=\frac{6}{10}=\frac35$.")

P(12,'geo',4,'Triangles',
 r"Triangle $ABC$ has $AB=13$, $BC=14$, and $CA=15$. Let $I$ be its incenter. What is $AI$?",
 r'\sqrt{65}',[r'\sqrt{50}','8',r'\sqrt{85}','10'], sqrt(65),
 "The incircle touches $AB$ at a point $s-a$ from $A$.",
 r"The semiperimeter is $s=21$, so the incircle touches $\overline{AB}$ at a point $s-BC=7$ from $A$. The inradius is $r=\frac{84}{21}=4$. By the Pythagorean theorem, $AI=\sqrt{7^2+4^2}=\sqrt{65}$.")

P(12,'geo',3,'Triangles',
 r"A point $P$ lies inside an equilateral triangle with side length $12$. What is the sum of the distances from $P$ to the three sides?",
 r'6\sqrt{3}',['6',r'12',r'9\sqrt{3}',r'12\sqrt{3}'], 6*sqrt(3),
 "Split the triangle into three triangles with a common vertex at $P$.",
 r"Joining $P$ to the vertices splits the triangle into three triangles with bases of length $12$ and heights $d_1,d_2,d_3$. Their areas add up to the whole: $\frac12\cdot12(d_1+d_2+d_3)=\frac{\sqrt3}{4}\cdot144$. So $d_1+d_2+d_3=6\sqrt3$, which is the altitude of the triangle.")

# ================= AMC 12 : NUMBER THEORY =================
P(12,'nt',1,'Modular arithmetic',
 r"What is the remainder when $3^{2026}$ is divided by $5$?",
 '4',['0','1','2','3'], pow(3,2026,5),
 r"Powers of $3$ modulo $5$ repeat with period $4$.",
 r"Modulo $5$ the powers of $3$ are $3,4,2,1,3,4,2,1,\ldots$. Since $2026=4\cdot506+2$, the remainder is the second entry, $4$.")

P(12,'nt',2,'GCD & LCM',
 r"What is $\gcd(2^{12}-1,\,2^{18}-1)$?",
 '63',['7','15','31','127'], math.gcd(2**12-1,2**18-1),
 r"Use $\gcd(2^a-1,2^b-1)=2^{\gcd(a,b)}-1$.",
 r"For positive integers $a,b$, $\gcd(2^a-1,2^b-1)=2^{\gcd(a,b)}-1$. Here $\gcd(12,18)=6$, so the answer is $2^6-1=63$.")

P(12,'nt',2,'Divisors',
 r"How many positive divisors of $2^{10}\cdot3^6$ are multiples of $12$?",
 '54',['35','66','70','77'], sum(1 for a in range(0,11) for b in range(0,7) if a>=2 and b>=1),
 r"Since $12=2^2\cdot3$, the divisor needs $2^a$ with $a\ge2$ and $3^b$ with $b\ge1$.",
 r"A divisor $2^a3^b$ is a multiple of $12=2^2\cdot3$ exactly when $a\ge2$ and $b\ge1$. There are $9$ choices for $a$ ($2$ through $10$) and $6$ for $b$ ($1$ through $6$), so $9\cdot6=54$.")

P(12,'nt',3,'Modular arithmetic',
 r"What is the sum of all positive integers $n<100$ with $n\equiv3\pmod7$ and $n\equiv2\pmod5$?",
 '156',['87','104','139','174'], sum(n for n in range(1,100) if n%7==3 and n%5==2),
 "Solutions repeat every $35$.",
 r"By the Chinese Remainder Theorem the solutions form one residue class mod $35$. Checking, $17$ works ($17=14+3$ and $17=15+2$). So $n=17,52,87$ below $100$, and the sum is $156$.")

P(12,'nt',2,'Digits',
 r"What is the sum of the digits of $10^{20}-3$?",
 '178',['160','169','171','180'], sum(map(int,str(10**20-3))),
 r"Write out $10^{20}-3$ explicitly.",
 r"$10^{20}-3=99999999999999999997$: nineteen $9$s followed by a $7$. The digit sum is $19\cdot9+7=178$.")

P(12,'nt',4,'Diophantine equations',
 r"How many ordered pairs $(a,b)$ of positive integers satisfy $a^2-b^2=2024$?",
 '4',['1','2','3','8'], sum(1 for a in range(1,1100) for b in range(1,a) if a*a-b*b==2024),
 r"Write $(a-b)(a+b)=2024$ and think about parity.",
 r"We need $(a-b)(a+b)=2024=2^3\cdot11\cdot23$. The factors $a-b$ and $a+b$ have the same parity, and their product is even, so both are even. Write them as $2u$ and $2v$ with $uv=506=2\cdot11\cdot23$ and $u<v$. The number $506$ has $8$ divisors, so there are $4$ such pairs $(u,v)$, and each gives a valid $(a,b)$.")

P(12,'nt',3,'Factorials',
 r"What is the remainder when $1!+2!+3!+\cdots+2026!$ is divided by $100$?",
 '13',['3','33','53','73'], sum(math.factorial(k) for k in range(1,10))%100,
 r"$10!$ and every larger factorial is a multiple of $100$.",
 r"For $n\ge10$, $n!$ is divisible by $100$ (it has at least two factors of $5$ and plenty of $2$s). So we only need $1!+\cdots+9!$ modulo $100$: the last two digits are $01,02,06,24,20,20,40,20,80$, which sum to $213\equiv13$.")

P(12,'nt',3,'Inclusion–exclusion',
 r"How many integers from $1$ to $1000$, inclusive, are divisible by exactly one of $3$ and $5$?",
 '401',['333','467','533','599'], sum(1 for n in range(1,1001) if (n%3==0)!=(n%5==0)),
 "Don’t count multiples of $15$.",
 r"There are $333$ multiples of $3$, $200$ multiples of $5$, and $66$ multiples of $15$. Numbers divisible by exactly one are $(333-66)+(200-66)=401$.")

P(12,'nt',2,'Divisors',
 r"What is the sum of the reciprocals of all positive divisors of $28$?",
 '2',[r'\frac{3}{2}',r'\frac{9}{4}',r'\frac{5}{2}','3'], sum(R(1,d) for d in divisors(28)),
 r"Each reciprocal $\frac1d$ equals $\frac{28/d}{28}$.",
 r"The reciprocals are $\frac1d=\frac{28/d}{28}$, and $28/d$ runs over the divisors of $28$ as $d$ does. So the sum is $\frac{\sigma(28)}{28}=\frac{1+2+4+7+14+28}{28}=\frac{56}{28}=2$.")

P(12,'nt',4,'Diophantine equations',
 r"What is the sum of all positive integers $n$ for which $n^2+24n$ is a perfect square?",
 '37',['26','29','33','45'], sum(n for n in range(1,5000) if sp.integer_nthroot(n*n+24*n,2)[1]),
 r"Complete the square: $n^2+24n=(n+12)^2-144$.",
 r"If $n^2+24n=m^2$, then $(n+12)^2-m^2=144$, so $(n+12-m)(n+12+m)=144$. The two factors have the same parity, so both are even: $(2,72)$, $(4,36)$, $(6,24)$, $(8,18)$ (and $(12,12)$, which gives $n=0$). These give $n+12=37,20,15,13$, i.e. $n=25,8,3,1$. The sum is $37$.")

# ================= AMC 12 : COUNTING & PROBABILITY =================
P(12,'cp',2,'Permutations',
 r"How many distinct arrangements are there of the letters in the word MISSISSIPPI?",
 r'34{,}650',[r'17{,}325',r'69{,}300',r'831{,}600',r'3{,}326{,}400'], math.factorial(11)//(math.factorial(4)*math.factorial(4)*math.factorial(2)),
 "Divide by the repeated letters.",
 r"There are $11$ letters: one M, four I’s, four S’s, and two P’s. The number of arrangements is $\frac{11!}{1!\,4!\,4!\,2!}=34{,}650$.")

P(12,'cp',4,'Recursion & tilings',
 r"A fair coin is flipped $10$ times. What is the probability that no two consecutive flips are both heads?",
 r'\frac{9}{64}',[r'\frac{1}{16}',r'\frac{1}{8}',r'\frac{5}{32}',r'\frac{11}{64}'], R(144,1024),
 "Count valid sequences with a recurrence on the length.",
 r"Let $a_n$ count length-$n$ sequences with no two adjacent heads. A valid sequence of length $n$ ends either in T (preceded by any valid sequence of length $n-1$) or in TH (preceded by any valid sequence of length $n-2$, since the T separates the H from what came before). So $a_n=a_{n-1}+a_{n-2}$ with $a_1=2$ and $a_2=3$. This gives $2,3,5,8,13,21,34,55,89,144$, so $a_{10}=144$. The probability is $\frac{144}{1024}=\frac{9}{64}$.")

def _tri():
    n=10; c=0
    for t in itertools.combinations(range(n),3):
        ok=True
        for i in range(3):
            for j in range(i+1,3):
                if (t[j]-t[i])%n in (1,n-1): ok=False
        c+=ok
    return c
P(12,'cp',4,'Inclusion–exclusion',
 r"How many triangles can be formed using the vertices of a regular decagon (a $10$-sided polygon) so that no side of the triangle is also a side of the decagon?",
 '50',['20','30','40','70'], _tri(),
 "Count all triangles, then subtract those with at least one decagon side.",
 r"There are $\binom{10}{3}=120$ triangles. Triangles with exactly two decagon sides are formed by three consecutive vertices: $10$ of them. Triangles with exactly one decagon side: choose the side ($10$ ways), then a third vertex not adjacent to either end ($10-4=6$ ways), giving $60$. So $120-10-60=50$.")

P(12,'cp',4,'Probability',
 r"A fair six-sided die is rolled repeatedly until a $6$ appears. What is the probability that the number of rolls needed is even?",
 r'\frac{5}{11}',[r'\frac{5}{12}',r'\frac{1}{2}',r'\frac{6}{11}',r'\frac{25}{36}'], R(5,11),
 "Sum a geometric series over $k=2,4,6,\\ldots$",
 r"The probability that the first $6$ occurs on roll $k$ is $\left(\frac56\right)^{k-1}\frac16$. Summing over even $k$ gives $\frac56\cdot\frac16\left(1+\frac{25}{36}+\left(\frac{25}{36}\right)^2+\cdots\right)=\frac{5/36}{11/36}=\frac{5}{11}$.")

def _coef():
    x=sp.Symbol('x'); return sp.Poly(sp.expand((1+x)**8*(1-x)**2),x).coeff_monomial(x**4)
P(12,'cp',3,'Binomial theorem',
 r"What is the coefficient of $x^4$ in the expansion of $(1+x)^8(1-x)^2$?",
 '-14',['-28','0','14','16'], _coef(),
 r"Rewrite using $(1+x)(1-x)=1-x^2$.",
 r"Write $(1+x)^8(1-x)^2=(1+x)^6(1-x^2)^2=(1+x)^6(1-2x^2+x^4)$. The coefficient of $x^4$ is $\binom64-2\binom62+\binom60=15-30+1=-14$.")

P(12,'cp',2,'Combinations',
 r"In how many ways can $6$ people be split into $3$ unordered pairs?",
 '15',['10','20','30','45'], math.factorial(6)//(2**3*math.factorial(3)),
 "Pair up the first person, then the next unpaired person, and so on.",
 r"The first person can pair with any of $5$ others; of the remaining $4$, the first can pair with any of $3$; then the last two pair up. That is $5\cdot3\cdot1=15$ (equivalently $\frac{6!}{2^3\cdot3!}=15$).")

P(12,'cp',3,'Probability',
 r"A bug starts at vertex $A$ of square $ABCD$. At each step it moves to one of the two adjacent vertices, chosen with equal probability. What is the probability that after $4$ steps the bug is at $A$?",
 r'\frac{1}{2}',[r'\frac{1}{16}',r'\frac{1}{4}',r'\frac{3}{8}',r'\frac{7}{16}'], R(1,2),
 "After an even number of steps the bug is at $A$ or at the opposite vertex.",
 r"After $2$ steps the bug is back at $A$ with probability $\frac12$ and at the opposite vertex $C$ with probability $\frac12$. From either of those, after $2$ more steps it is at $A$ with probability $\frac12$. So the answer is $\frac12$.")

P(12,'cp',5,'Probability',
 r"Two numbers $x$ and $y$ are chosen independently and uniformly at random from the interval $[0,1]$. What is the probability that $xy<\dfrac12$?",
 r'\frac{1+\ln 2}{2}',[r'\frac{1}{2}',r'1-\frac{\ln 2}{2}',r'\frac{3}{4}',r'\frac{5}{6}'], (1+log(2))/2,
 r"Find the probability of the complement, $xy\ge\frac12$, as an area under $y=\frac{1}{2x}$.",
 r"The region $xy\ge\frac12$ in the unit square lies under $y=1$ and above $y=\frac1{2x}$, for $x$ from $\frac12$ to $1$. Its area is $\int_{1/2}^{1}\left(1-\frac1{2x}\right)dx=\frac12-\frac12\ln2$. So $P(xy<\frac12)=1-\frac12+\frac12\ln2=\frac{1+\ln2}{2}$.")

P(12,'cp',4,'Counting principle',
 r"The four vertices of a square are each colored one of $3$ colors, so that adjacent vertices always have different colors. How many colorings are possible? (Colorings that differ by a rotation count as different.)",
 '18',['9','12','16','24'], sum(1 for c in itertools.product(range(3),repeat=4) if all(c[i]!=c[(i+1)%4] for i in range(4))),
 "Split into cases by whether the two opposite pairs match.",
 r"Color vertices $1$ to $4$ in order around the square. Either vertices $1,3$ have the same color or different colors. If the same ($3$ choices), then vertices $2$ and $4$ each avoid that color: $2\cdot2=4$ ways, for $12$. If different ($3\cdot2=6$ choices), vertices $2$ and $4$ must avoid both colors, so each has $1$ choice: $6$. The total is $12+6=18$.")

P(12,'cp',3,'Combinations',
 r"How many $5$-element subsets of $\{1,2,\ldots,12\}$ contain no two consecutive integers?",
 '56',['35','70','126','792'], math.comb(8,5),
 r"Map a valid subset $a_1<\cdots<a_5$ to $a_i-(i-1)$.",
 r"For a subset $a_1<a_2<\cdots<a_5$ with no two consecutive, subtract $i-1$ from $a_i$. This gives an arbitrary $5$-element subset of $\{1,\ldots,8\}$ and the map is reversible. So the count is $\binom85=56$.")
