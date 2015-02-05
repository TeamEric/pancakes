import java.io.*;

class fileMaker{

	public static void main(String[] args){
		for(int i=0;i<=300;i++){
			try{
				OutputStream output = new FileOutputStream("note.txt");
				if(i<10){
					output=new FileOutputStream("note_00"+i+".txt");
				}
				else if(i<100){
					output=new FileOutputStream("note_0"+i+".txt");
				}
				else{
					output=new FileOutputStream("note_"+i+".txt");
				}
				PrintStream printOut = new PrintStream(output);
				printOut.print("Note "+i+": nothing to display.");
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