import java.io.*;

class fileMaker{

	public static void main(String[] args){
		for(int i=0;i<=300;i++){
			try{
				OutputStream output = new FileOutputStream("trsc.txt");
				if(i<10){
					output=new FileOutputStream("trsc_00"+i+".txt");
				}
				else if(i<100){
					output=new FileOutputStream("trsc_0"+i+".txt");
				}
				else{
					output=new FileOutputStream("trsc_"+i+".txt");
				}
				PrintStream printOut = new PrintStream(output);
				printOut.print("Transcription "+i+": nothing to display.");
				System.setOut(printOut);
				System.out.flush();
				printOut.close();
				output.close();
			}
			catch(Exception e){
				System.out.println("Cannot write to file.");
			} 
		}	
	}

}